from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import numpy as np, math, json
from string import ascii_lowercase as letters
from random import random, sample
from collections import Counter
import re

# Create your views here.

def calculate(x, pt, aunit):
    #pt -> disp name & option dic params
    vars_data = [('@anpu', 'acos', 'ur'),('@aspy', 'acosh', 'ur'),('@bovn', 'asin', 'ur'),('@bowq', 'asinh', 'ur'),('@cgfn', 'atan', 'ur'),('@cniy', 'atanh', 'ur'),('@cxgm', 'cbrt', 'ur'),('@dcau', 'comb', 'bi'),('@dghm', 'cos', 'ur'),('@ewqa', 'cosh', 'ur'),('@fcdp', 'deci', 'ul'),('@fymn', 'deg', 'ul'),('@gpza', 'estmx1', 'ul'),('@hfki', 'estmx2', 'ul'),('@hnyu', 'estmy', 'ul'),('@hsid', 'factorial', 'ul'),('@hxzg', 'grad', 'ul'),('@ialr', 'ln', 'ur'),('@idgp', 'log', 'ur'),('@jaxo', 'perm', 'bi'),('@jdct', 'polar', 'idptfun_p'),('@jdhm', 'port', 'idpt'),('@jkya', 'rad', 'ul'),('@jnuw', 'rect', 'idptfun_r'),('@jqco', 'sin', 'ur'),('@kdvz', 'sinh', 'ur'),('@khcb', 'sqrt', 'ur'),('@kjba', 'tan', 'ur'),('@kwio', 'tanh', 'ur'),('@loka', 'xroot', 'bi'),('@ryoi', 'e', 'idptv'),('@ukgj', 'pi', 'idptv')]
    
    class BaseOp(object):
        def __init__(self,x,y):
            self.x = x
            self.y = y
            
        def __str__(self):
            return f'({self.x}, {self.y})'
        
        def __format__(self, val):
            return f'({self.x:{val}}, {self.y:{val}})' 
        @property    
        def cords(self):
            return self.x, self.y
            
        def compute(self,other,op):
            if isinstance(other,(int,float,complex)):
                x, y = eval(f"{self.x} {op} {other}"), eval(f"{self.y} {op} {other}")
                return BaseOp(x,y)
            x, y = eval(f"{self.x} {op} {other.x}"), eval(f"{self.y} {op} {other.y}")
            return BaseOp(x,y)
            
        def __add__(self,other):
            return self.compute(other,"+")
        
        def __radd__(self,other):
            return self.compute(other,"+")
            
        def __sub__(self,other):
            return self.compute(other,"-")
            
        def __rsub__(self,other):
            return self.compute(other,"-")
            
        def __mul__(self,other):
            return self.compute(other,"*")
            
        def __rmul__(self,other):
            return self.compute(other,"*")
            
        def __truediv__(self,other):
            return self.compute(other,"/")
            
        def __rtruediv__(self,other):
            return self.compute(other,"/")
        
        def __pow__(self,other):
            return self.compute(other,"**")
            
        def __rpow__(self,other):
            return self.compute(other,"**")
            
    class rect(BaseOp):
        pass
    class polar(BaseOp):
        pass
    class port(BaseOp):
        pass
    
    def stk(x):
        if type(x) == list:
            l = Counter(''.join(x))["("]
            r = Counter(''.join(x))[")"]
        elif type(x) == str:
            l = Counter(x)["("]
            r = Counter(x)[")"]
        return l == r
        
    def bracs(x, s="r"):
        re1 = "[\w,@,\(,\),\.,!,\s]"
        a = []
        if s == "r":
            x += "$$"
            for i, c in enumerate(x):
                if  all([re.match(re1, c), stk(a+[c]), not re.match(re1, x[i+1])]):
                    a.append(c)
                    return ''.join(a)
                if c in "+/*-),$ " and stk(a):
                    return ''.join(a)
                a.append(c)
            raise SyntaxError("Error: missing bracket(s)")
        x = x[::-1]+"$$"   
        for i, c in enumerate(x):
            if  all([re.match(re1, c),stk(a+[c]),not re.match(re1, x[i+1])]):
                a.insert(0,c)
                return ''.join(a)
            if c in "+/*-(,$ " and stk(a):
                return ''.join(a)
            a.insert(0,c)
        raise SyntaxError("Error: missing bracket(s)")
        
    def get_args(x, y, i, func, d="ul"):
        ls, rs = x[:i],  x[i+len(y):]
        num, num2 = bracs(ls,"l"), bracs(rs)
        
        #d -> direction e.g uni-left, uni-right, bi, idpt(independent - has args)
        if d == "ul":
            if y == "@dci":
                z = bracs(rs)
                if z.count("@dci") > 3:
                    raise SyntaxError("Error: time unit allows max four args")
                _args = z.split("@dci")
                args = num + ',' + ','.join(_args[:-1]) if "@dci" in z else num
                x = ls[:-len(num)] + f'{func}({args})' + _args[-1] + rs[len(z):]
            else:
                x = ls[:-len(num)] + f'{func}({num})' + rs
            match = x.find(y)
            return x
            
        elif d == "ur":
            x = ls + f'{func}({num2})' + rs[len(num2):]
            return x
            
        elif d.startswith("idpt"):
            regx = "\(+[\w\W\s]+\)+"
            matched = re.match(regx, num2)
            new_num, rem = "", ""
            if matched:
                new_num = matched.group()
                rem = num2[len(new_num):]
            elif d == "idptv":
                pass
            else:
                raise SyntaxError("Error: unmatched agrs")
                
            if d == "idpt":
                x = ls + f"{func}{new_num}{rem}" + rs[len(num2):]
                return x
                
            elif d == "idptv":
                x = ls + func + rs
                return x
                
            #d -> with new func arg for polar & rec    
            fidpt = d[4:]
            x = ls + f"{func}(*{fidpt}{new_num}{rem})" + rs[len(num2):]
            return x
            
        # d -> bi   
        x = ls[:-len(num)] + f'{func}({num},{num2})' + rs[len(num2):]
        return x
    
    def priority(x,l):
        l = [(x.find(i[0]), i) for i in l]
        z = {i[0]:i[1] for i in list(filter(lambda a: a[0] >= 0, l))}
        if z:
            k = min(sorted(z.keys()))
            return k,z[k]
        return None
        
    def sin(x):
        if aunit == "deg":
            return math.sin(math.radians(x))
        elif aunit == "grad":
            return math.sin(x*math.pi/200)
        return math.sin(x)
        
    def asin(x):
        if aunit == "deg":
            return math.degrees(math.asin(x))
        elif aunit == "grad":
            return math.degrees(math.asin(x))/0.9
        return math.asin(x)
        
    def cos(x):
        if aunit == "deg":
            return math.cos(math.radians(x))
        elif aunit == "grad":
            return math.cos(x*math.pi/200)
        return math.cos(x)
        
    def acos(x):
        if aunit == "deg":
            return math.degrees(math.acos(x))
        elif aunit == "grad":
            return math.degrees(math.acos(x))/0.9
        return math.acos(x)
        
    def tan(x):
        if aunit == "deg":
            return math.tan(math.radians(x))
        elif aunit == "grad":
            return math.tan(x*math.pi/200)
        return math.tan(x)
        
    def atan(x):
        if aunit == "deg":
            return math.degrees(math.atan(x))
        elif aunit == "grad":
            return math.degrees(math.atan(x))/0.9
        return math.atan(x)
        
    def fun_p(x, y): #polar
        radius = math.hypot(x,y)
        theta = math.atan2(y, x)
        if aunit == "deg":
            return radius, math.degrees(theta)
        if aunit == "grad":
            return radius, math.degrees(theta)/0.9
        return radius, theta
        
    def fun_r(r, theta): #rect
        x = r*cos(theta)
        y = r*sin(theta)
        return x, y
        
    def xroot(x, y):
        return math.pow(x, y)
        
    def deg(x):
        if aunit == "grad":
            return x/0.9
        elif aunit == "rad":
            return math.radians(x)
        return x
    
    def rad(x):
        if aunit == "deg":
            return math.degrees(x)
        elif aunit == "grad":
            return x/(math.pi/200)
        return x
    
    def grad(x):
        if aunit == "deg":
            return x*0.9
        elif aunit == "rad":
            return x*(math.pi)/200
        return x
        
    def deci(h, m=0, s=0, c=0):
        return h+m/60+s/3600+c/360000
        
    rand = float(format(random(), ".3f"))
    constants = {"pi":math.pi, "e":math.e}
    trig = {"sin":sin, "sinh":math.sinh, "asin":asin, "asinh":math.asinh, "cos":cos, "cosh":math.cosh, "acos":acos, "acosh":math.acosh, "tan":tan, "tanh":math.tanh, "atan":atan, "atanh":math.atanh}
    logs = {"ln":math.log, "log":math.log10}
    roots = {"sqrt":math.sqrt, "cbrt":np.cbrt,"xroot":xroot}
    angular = {"deg":deg, "rad":rad, "grad":grad, "polar":polar, "rect":rect, "fun_r":fun_r, "fun_p":fun_p}
    otherfs = {"factorial":math.factorial, "perm":math.perm, "comb":math.comb, "deci":deci, "port":port}
    try:
        m = priority(x,vars_data)
        while m:
            i,(y,f,d) = m
            x = get_args(x,y,i,f,d)
            m = priority(x,vars_data)
        res = eval(x, {"@rand":rand, **logs, **constants, **roots, **otherfs, **angular, **trig})
        def res_format(x):
            if pt["disp"] == "fix":
                return x, format(x, f",.{str(pt['option'])}f")
            elif pt["disp"] == "sci":
                return x, format(x, f".{str(pt['option'])}e")
            elif pt["disp"] == "norm" and pt["option"] == 1:
                snum = format(x, "e")
                e_sub = snum[snum.index("e"):]
                snum = snum.rstrip(e_sub).rstrip("0")
                return x, (snum + "0" + e_sub) if snum.endswith(".") else (snum + e_sub)
            snum = format(x, ",.12f").rstrip("0").rstrip(".")
            return x, 0 if snum == "-0" else snum
        
        if not isinstance(res, (int, float, complex)):
            x, y = res.cords
            return res_format(x), res_format(y)
        return res_format(res)
    except SyntaxError as s:
        return 0, "Syntax Error"
    except Exception as e:
        return 0, "Math Error"
        
def calculator(request):
    return render(request,'calc/calc.html')
    
def ajaxreq(request):
    expr = request.POST["expr"]
    pt = json.loads(request.POST["pt"])
    aunit = request.POST["aunit"]
    x, y = calculate(expr, pt, aunit)
    if type(x) == tuple:
        return JsonResponse({"res":[x[0], y[0]], "resf":[x[1], y[1]]})
    return JsonResponse({"res":x, "resf":y})