from scipy.optimize import curve_fit
import numpy as np, math, re, statistics as stats
from random import random
from collections import Counter

# Create your views here.
vars_data = [('@anpu', 'acos', 'ur'),('@aspy', 'acosh', 'ur'),('@bovn', 'asin', 'ur'),('@bowq', 'asinh', 'ur'),('@cgfn', 'atan', 'ur'),('@cniy', 'atanh', 'ur'),('@cxgm', 'cbrt', 'ur'),('@dcau', 'comb', 'bi'),('@dghm', 'cos', 'ur'),('@ewqa', 'cosh', 'ur'),('@fcdp', 'deci', 'bi'),('@fymn', 'deg', 'ul'),('@gpza', 'estmx', 'ul'),('@hnyu', 'estmy', 'ul'),('@hqzn', 'exponent', 'bi'),('@hsid', 'factorial', 'ul'),('@hxzg', 'grad', 'ul'),('@ialr', 'ln', 'ur'),('@idgp', 'log', 'ur'),("@iprt", "percent", "ul"),('@jaxo', 'perm', 'bi'),('@jdct', 'polar', 'idpt'),('@jkya', 'rad', 'ul'),('@jnuw', 'rect', 'idpt'),('@jqco', 'sin', 'ur'),('@kdvz', 'sinh', 'ur'),('@khcb', 'sqrt', 'ur'),('@kjba', 'tan', 'ur'),('@kwio', 'tanh', 'ur'),('@loka', 'xroot', 'bi')]
pt = {}; aunit = ""

class PolRec(object):
    def __init__(self, x="", y=""):
        self.x = x
        self.y = y
        self.items = {0:x, 1:y}
        
    def __str__(self):
        return f'({self.x}, {self.y})'
        
    def __getitem__(self, index):
        return self.items[index]
        
    def __format__(self, val):
        return f'({self.x:{val}} :: {self.y:{val}})' 
    
    @property
    def cords(self):
        return (self.x, self.y)
        
    def compute(self,other,op, s="l"):
        if isinstance(other,(int,float,complex)):
            if s == "l":
                x, y = eval(f"{self.x} {op} {other}"), eval(f"{self.y} {op} {other}")
            else:
                x, y = eval(f"{other} {op} {self.x}"), eval(f"{other} {op} {self.y}")
            return PolRec(x,y)
        if s == "l": # if false from isinstance
            x, y = eval(f"{self.x} {op} {other.x}"), eval(f"{self.y} {op} {other.y}")
        else:
            x, y = eval(f"{other.x} {op} {self.x}"), eval(f"{other.y} {op} {self.y}")
        return PolRec(x,y)
        
    def __add__(self,other):
        return self.compute(other,"+")
    
    def __radd__(self,other):
        return self.compute(other,"+","r")
        
    def __sub__(self,other):
        return self.compute(other,"-")
        
    def __rsub__(self,other):
        return self.compute(other,"-","r")
        
    def __mul__(self,other):
        return self.compute(other,"*")
        
    def __rmul__(self,other):
        return self.compute(other,"*","r")
        
    def __truediv__(self,other):
        return self.compute(other,"/")
        
    def __rtruediv__(self,other):
        return self.compute(other,"/","r")
    
    def __pow__(self,other):
        return self.compute(other,"**")
        
    def __rpow__(self,other):
        return self.compute(other,"**","r")
        
class RectCls(PolRec):
    def __call__(self, r, theta):
        x = r*cos(theta)
        y = r*sin(theta)
        self.x = x
        self.y = y
        return PolRec(x, y)
        
class PolarCls(PolRec):
    def __call__(self, x, y):
        radius = math.hypot(x,y)
        theta = math.atan2(y, x)
        if aunit == "deg":
            theta = math.degrees(theta)
        elif aunit == "grad":
            theta = math.degrees(theta)/0.9
        self.x = radius
        self.y = theta
        return PolRec(radius, theta)

class StatsData:
    def __init__(self, attrs):
        for key, val in attrs.items():
            setattr(self, key, val)

def stdevn(x):
    return {"sum2x":sum([i**2 for i in x]),"sumx":sum(x),"nobs":len(x),"meanx":stats.mean(x),"stdx":stats.pstdev(x),"sdx":stats.stdev(x) if len(x) > 1 else "nan"}

def regression(x, y, regf):
    x, y = np.array(x), np.array(y)
    popt, pcov = curve_fit(regf, x, y, method="trf")
    r = np.corrcoef(y,regf(x, *popt))[0,1]
    popt = {"coefa":popt[0],"coefb":popt[1],"coefc":popt[2]} if len(popt) > 2 else {"coefa":popt[0],"coefb":popt[1]}
    means = {"meanx":np.mean(x), "meany":np.mean(y)}
    stds = {"stdx":np.std(x),"sdx":np.std(x, ddof=1),"stdy":np.std(y),"sdy":np.std(y, ddof=1)}
    _sums = {"nobs":len(x),"sumx":np.sum(x),"sum2x":np.sum(x**2),"sumy":np.sum(y),"sum2y":np.sum(y**2),"sumxy":np.sum(x*y),"sum3x":np.sum(x**3),"sum2xy":np.sum(x**2*y),"sum4x":np.sum(x**4)}
    return StatsData({**popt, "coefr":r, **means, **stds, **_sums})
    
def lin_reg(x, y):
    regf = lambda x, a, b: a + b*x
    data = regression(x, y, regf)
    a, b = data.coefa, data.coefb
    estmy = f"@hnyu({a}+{b}*@zstq)"
    estmx = f"@gpza((@zstq-{a})/{b})"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__
    
def log_reg(x, y):
    regf = lambda x, a, b: a + b*np.log(x)
    data = regression(x, y, regf)
    a, b = data.coefa, data.coefb
    estmy = f"@hnyu({a}+{b}*ln(@zstq))"
    estmx = f"@gpza(e**((@zstq-{a})/{b}))"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__
    
def exp1_reg(x, y):
    regf = lambda x, a, b: a*np.exp(b*x)
    data = regression(x, y, regf)
    a, b = data.coefa, data.coefb
    estmy = f"@hnyu({a}*e**({b}*@zstq))"
    estmx = f"@gpza(ln(@zstq/{a})/{b})"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__
    
def exp2_reg(x, y):
    regf = lambda x, a, b: a*b**x
    data = regression(x, y, regf)
    a, b = data.coefa, data.coefb
    estmy = f"@hnyu({a}*{b}**@zstq)"
    estmx = f"@gpza(ln(@zstq/{a})/ln({b}))"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__

def pow_reg(x, y):
    regf = lambda x, a, b: a*x**b
    data = regression(x, y, regf)
    a, b = data.coefa, data.coefb
    estmy = f"@hnyu({a}*@zstq**{b})"
    estmx = f"@gpza((@zstq/{a})**(1/{b}))"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__
    
def inv_reg(x, y):
    regf = lambda x, a, b: a + b/x
    data = regression(x, y, regf)
    a, b = data.coefa, data.coefb
    estmy = f"@hnyu({a}+{b}/@zstq)"
    estmx = f"@gpza({b}/(@zstq-{a}))"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__
    
def quad_reg(x, y):
    regf = lambda x, a, b, c: a + b*x +c*x**2
    data = regression(x, y, regf)
    a, b, c = data.coefa, data.coefb, data.coefc
    estmy = f"@hnyu({c}*@zstq**2+{b}*@zstq+{a})"
    estmx = f"@gpza({c}&{b}&{a}-@zstq)"
    setattr(data,"estmx",estmx); setattr(data, "estmy",estmy)
    return data.__dict__

def estmy(x):
    return x

def estmx(*x):
    if len(x) > 1:
        a, b, c = x
        d_s = math.sqrt(b**2-4*a*c)
        return PolRec((-b+d_s)/(2*a), (-b-d_s)/(2*a))
    return x[0]

def stk(x):
    if type(x) == list:
        l = Counter(''.join(x))["("]
        r = Counter(''.join(x))[")"]
    elif type(x) == str:
        l = Counter(x)["("]
        r = Counter(x)[")"]
    return l == r
    
def bracs(x, s="r", d=""):
    if not x:
        raise SyntaxError("Error: missing argument")
    dollar = lambda k: re.findall("\$+$",k)
    x += "$$"
    arg = ""
    if s == "r":
        for i, c in enumerate(x):
            arg += c
            if c == "$":
                raise SyntaxError("Error: missing bracket(s)")
            if c == ")" and stk(arg[:-1]):
                return arg[:-1]
            elif x[i+1] in "+/*)-$, " and stk(arg) and not re.findall("([\+-]+)$", arg):
                if dollar(arg):
                    return arg[:-len(dollar(arg)[0])]
                return arg
    # if s = l
    x2 = list("$$" + x[:-2])
    while True:
        arg = x2.pop() + arg
        pm = re.findall("(\([\+-]+)$",''.join(x2))
        if arg[0] == "$":
            raise SyntaxError("Error: missing bracket(s)")
        if arg[0] == "(" and stk(arg[1:]):
            return arg[1:]
        if stk(arg) and pm:
            arg = pm[0][1:]+arg
            if dollar(arg):
                return arg[:-len(dollar(arg)[0])]
            return arg
        if x2[-1] in "+/*-()$, " and stk(arg):
            if dollar(arg):
                return arg[:-len(dollar(arg)[0])]
            return arg
            
def priority(x,l):
    l = [(x.find(i[0]), i) for i in l]
    z = {i[0]:i[1] for i in list(filter(lambda a: a[0] >= 0, l))}
    if z:
        k = min(sorted(z.keys()))
        return k,z[k]
    return None

def f_args(x, y, i, fn, d):
    ls, rs = x[:i], x[i+len(y):]
    if d == "bi" and y in ["@fcdp", "@dcau", "@jaxo", "@hqzn", "@loka"]:
        num, num2 = bracs(ls, "l"), ""
        if rs:
            num2 = bracs(rs)
        z1, z2 = ls[:-len(num)], rs[len(num2):]
        l = [] # more args list
        a = "" # new arg
        for  c in num2+"$$":
            a += c
            if c == "$":
                if stk(a) and a[:-1].endswith(y):
                    l.append(a[:-1])
                break
            if a.endswith(y) and stk(a):
                l.append(a)
                a = ""
            elif c in "*/" and stk(a[:-1]):
                l.append(a[:-1])
                break
        rs_num2 = num2[len(''.join(l)):]
        rs = rs_num2 + z2
        l = list(map(lambda k: k[:-5] if k.endswith(y) else k, l))
        args = ','.join([num]+l)
        if y == "@fcdp":
            if len(l) > 3:
                raise SyntaxError("Error: too many args for deci function")
            x = z1+ f"{fn}({args})"+rs
        else:
            num3 = bracs(rs)
            args += ","+num3
            x = z1+ f"{fn}({args})"+rs[len(num3):]
            
    elif d == "ul":
        num = bracs(ls, "l")
        if y in ("@hnyu", "@gpza"):
            num2 = bracs(rs)
            x = (ls[:-len(num)] + fn + num2.replace("@zstq", num) + rs[len(num2):]).replace("&", ",")
        else:
            x = ls[:-len(num)] + f'{fn}({num})' + rs
        
    elif d == "ur":
        num2 = bracs(rs)
        x = ls + f'{fn}({num2})' + rs[len(num2):]       
         
    elif d == "idpt":
        num2 = bracs(rs)
        polrec = bracs(num2)
        rem = num2[len(polrec):]
        x = ls + f"{fn}{polrec}{rem}" + rs[len(num2):]
    return x
    
def insta(x):
    return isinstance(x, (PolRec))
    
def expr(x):
    m = priority(x,vars_data)
    while m:
        i,(y,f,d) = m
        x = f_args(x,y,i,f,d)
        m = priority(x,vars_data)
    return x

def exponent(x,*y):
    result = x**y[0]
    if len(y) > 1:
        for i in y[1:]:
            result = result**i
    return result
    
def xroot(x,*y):
    result = y[0]**(1/x)
    if len(y) > 1:
        for i in y[1:]:
            result = i**(1/result)
    return result
    
def comb(x,*y):
    result = math.comb(x, y[0])
    if len(y) > 1:
        for i in y[1:]:
            result = math.comb(result, i)
        return result
    return result
    
def perm(x,*y):
    result = math.perm(x, y[0])
    if len(y) > 1:
        for i in y[1:]:
            result = math.perm(result, i)
        return result
    return result
    
def sin(x):
    def _sin(x):
        if aunit == "deg":
            return math.sin(math.radians(x))
        elif aunit == "grad":
            return math.sin(x*math.pi/200)
        return math.sin(x)
    if insta(x):
        return PolRec(_sin(x[0]), _sin(x[1]))
    return _sin(x)
    
def asin(x):
    def _asin(x):
        if aunit == "deg":
            return math.degrees(math.asin(x))
        elif aunit == "grad":
            return math.degrees(math.asin(x))/0.9
        return math.asin(x)
    if insta(x):
        return PolRec(_asin(x[0]), _asin(x[1]))
    return _asin(x)

def sinh(x):
    if insta(x):
        return PolRec(math.sinh(x[0]), math.sinh(x[1]))
    return math.sinh(x)
    
def asinh(x):
    if insta(x):
        return PolRec(math.asinh(x[0]), math.asinh(x[1]))
    return math.asinh(x)
    
def cos(x):
    def _cos(x):
        if aunit == "deg":
            return math.cos(math.radians(x))
        elif aunit == "grad":
            return math.cos(x*math.pi/200)
        return math.cos(x)
    if insta(x):
        return PolRec(_cos(x[0]), _cos(x[1]))
    return _cos(x)
    
def acos(x):    
    def _acos(x):
        if aunit == "deg":
            return math.degrees(math.acos(x))
        elif aunit == "grad":
            return math.degrees(math.acos(x))/0.9
        return math.acos(x)
    if insta(x):
        return PolRec(_acos(x[0]), _acos(x[1]))
    return _acos(x)

def cosh(x):
    if insta(x):
        return PolRec(math.cosh(x[0]), math.cosh(x[1]))
    return math.cosh(x)
    
def acosh(x):
    if insta(x):
        return PolRec(math.acosh(x[0]), math.acosh(x[1]))
    return math.acosh(x)
    
def tan(x):
    def _tan(x):
        if aunit == "deg":
            return math.tan(math.radians(x))
        elif aunit == "grad":
            return math.tan(x*math.pi/200)
        return math.tan(x)
    if insta(x):
        return PolRec(_tan(x[0]), _tan(x[1]))
    return _tan(x)
    
def atan(x):
    def _atan(x):
        if aunit == "deg":
            return math.degrees(math.atan(x))
        elif aunit == "grad":
            return math.degrees(math.atan(x))/0.9
        return math.atan(x)
    if insta(x):
        return PolRec(_atan(x[0]), _atan(x[1]))
    return _atan(x)

def tanh(x):
    if insta(x):
        return PolRec(math.tanh(x[0]), math.tanh(x[1]))
    return math.tanh(x)
    
def atanh(x):
    if insta(x):
        return PolRec(math.atanh(x[0]), math.atanh(x[1]))
    return math.atanh(x)
    
def deg(x):    
    def _deg(x):
        if aunit == "grad":
            return x/0.9
        elif aunit == "rad":
            return math.radians(x)
        return x
    if insta(x):
        return PolRec(_deg(x[0]), _deg(x[1]))
    return _deg(x)

def rad(x):
    def _rad(x):
        if aunit == "deg":
            return math.degrees(x)
        elif aunit == "grad":
            return x/(math.pi/200)
        return x
    if insta(x):
        return PolRec(_rad(x[0]), _rad(x[1]))
    return _rad(x)

def grad(x):
    def _grad(x):
        if aunit == "deg":
            return x*0.9
        elif aunit == "rad":
            return x*(math.pi)/200
        return x
    if insta(x):
        return PolRec(_grad(x[0]), _grad(x[1]))
    return _grad(x)
    
def deci(h, m=0, s=0, c=0):
    return h+m/60+s/3600+c/360000

def factorial(x):
    if insta(x):
        return PolRec(math.factorial(x[0]), math.factorial(x[1]))
    return math.factorial(x)
    
def log(x):
    if insta(x):
        return PolRec(math.log(x[0]), math.log(x[1]))
    return math.log(x)
    
def log10(x):
    if insta(x):
        return PolRec(math.log10(x[0]), math.log10(x[1]))
    return math.log10(x)
    
def sqrt(x):
    if insta(x):
        return PolRec(math.sqrt(x[0]), math.sqrt(x[1]))
    return math.sqrt(x)
    
def cbrt(x):
    if insta(x):
        return PolRec(np.cbrt(x[0]), np.cbrt(x[1]))
    return np.cbrt(x)
    
def percent(x):
    return x/100
    
def formatter(x):
    if pt["disp"] == "fix":
        return x, format(x, f",.{str(pt['option'])}f")
    elif pt["disp"] == "sci":
        return x, format(x, f".{str(pt['option'])}e")
    # disp norm
    _regex = lambda x, _re, p2, p1: "0" if (re.match("-0", x) and re.search("\.0+"+_re, x)) else (re.sub("0+"+_re, p2, x) if re.search("[1-9]0+"+_re, x) else re.sub("\.0+"+_re, p1, x))
    optl = {1:["e", "e", ".0e"], 2:["$", "", ".0"]}[pt["option"]]
    optf, optd = {1:["e", ""], 2:["f", ","]}[pt["option"]]
    if insta(x):
        f1, f2 = format(x[0], f"{optd}.12{optf}"), format(x[1], f"{optd}.12{optf}")
        _fs = [re.sub("\.0$", "", _regex(i, *optl)) for i in (f1, f2)]
        return x, f"({_fs[0]} :: {_fs[1]})"
    return x, re.sub("\.0$", "", _regex(format(x, f"{optd}.12{optf}"), *optl))
    
trig = {"sin":sin, "sinh":sinh, "asin":asin, "asinh":asinh, "cos":cos, "cosh":cosh, "acos":acos, "acosh":acosh, "tan":tan, "tanh":tanh, "atan":atan, "atanh":atanh}
constants = {"pi":math.pi, "e":math.e, "nan":math.nan}
logs = {"ln":log, "log":log10}
roots = {"sqrt":sqrt, "cbrt":cbrt,"xroot":xroot}
angular = {"deg":deg, "rad":rad, "grad":grad, "polar":PolarCls(), "rect":RectCls()}
otherfs = {"factorial":factorial, "perm":perm, "comb":comb, "deci":deci, "exponent":exponent, "estmx":estmx, "estmy":estmy, "percent":percent}

def calculate(x, _pt, _aunit):
    #pt -> disp name & option dic params
    global pt; global aunit
    pt = _pt; aunit = _aunit
    try:
        result = eval(expr(x), {"rand":float(format(random(), ".4f")), **logs, **constants, **roots, **otherfs, **angular, **trig}) if expr(x) else 0
        return formatter(result)
    except (SyntaxError, TypeError, IndexError, EOFError) as e:
        return "Error", str(e) #"Syntax Error"
    except Exception as e:
        return "Error", str(e) #"Math Error"