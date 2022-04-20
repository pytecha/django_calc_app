from django.shortcuts import render
from django.http import JsonResponse
import numpy as np, json
from random import random
# Create your views here.
    
def calculate(expr, labels, pt, aunit):
    def grad2rad(x):
        return x*(np.pi)/200
        
    def sin(x):
        if aunit == "deg":
            return np.sin(np.radians(x))
        elif aunit == "grad":
            return np.sin(grad2rad(x))
        return np.sin(x)
        
    def cos(x):
        if aunit == "deg":
            return np.cos(np.radians(x))
        elif aunit == "grad":
            return np.cos(grad2rad(x))
        return np.cos(x)
        
    def tan(x):
        if aunit == "deg":
            return np.tan(np.radians(x))
        elif aunit == "grad":
            return np.tan(grad2rad(x))
        return np.tan(x)
    rand = float(format(random(), ".3f"))
    constants = {"pi":np.pi, "e":np.e}
    trig = {"sin":sin, "cos":cos, "tan":tan}
    logs = {"log":np.log, "log10":np.log10}
    try:
        res = eval(expr, {"rand":rand, **logs, **constants, **trig, **labels})
        if pt["disp"] == "fix":
            return res, format(res, f",.{str(pt['option'])}f")
        elif pt["disp"] == "sci":
            return res, format(res, f".{str(pt['option'])}e")
        elif pt["disp"] == "norm" and pt["option"] == 1:
            snum = format(res, "e")
            e_sub = snum[snum.index("e"):]
            snum = snum.rstrip(e_sub).rstrip("0")
            return res, (snum + "0" + e_sub) if snum.endswith(".") else (snum + e_sub)
        snum = format(res, ",.12f").rstrip("0").rstrip(".")
        return res, 0 if snum == "-0" else snum
    except SyntaxError as s:
        return 0, "Syntax Error"
    except Exception as e:
        return 0, "Math Error"
    
def calculator(request):
    return render(request,'calc/calc.html')
    
def ajaxreq(request):
    labels = json.loads(request.POST["labels"])
    expr = request.POST["expr"]
    pt = json.loads(request.POST["pt"])
    aunit = request.POST["aunit"]
    res, resf = calculate(expr, labels, pt, aunit)
    return JsonResponse({"res":res, "resf":resf})