from django.http import JsonResponse, HttpResponse
from concurrent.futures import ThreadPoolExecutor
from django.shortcuts import render
from .calcfns import *
import json

def calculator(request):
    return render(request,'calc/calc.html')
    
def ajaxreq(request):
    expr = request.POST["expr"]
    mode = request.POST["mode"]
    pt = json.loads(request.POST["pt"])
    aunit = request.POST["aunit"]
    
    def _calculate(x):
        return calculate(x, pt, aunit)
        
    try:  
        _expr = expr.split(";")[0]
    except IndexError:
        _expr = "error"
        
    if mode in ["reg", "sd"]:
        if "," in _expr and mode != "sd":
            _exprs = _expr.split(",")
            xy_map = map(_calculate, _exprs)
            (x, _x), (y, _y) = xy_map
            result = PolRec(x,y), f"({_x} :: {_y})"
        else:
            result = calculate(_expr, pt, aunit)
    else:
        result = calculate(expr, pt, aunit)
    
    return JsonResponse({
        "result":result[0].cords if insta(result[0]) else result[0],
        "resform":result[1],
        "expr":globals()["expr"](expr)
    })

def ajaxsci(request):
    history = json.loads(request.POST["history"])
    _expr = request.POST["expr"]
    mode = request.POST["mode"]
    pt = json.loads(request.POST["pt"])
    aunit = request.POST["aunit"]
    re1 = "[\w0-9@#\.\+\*/-]+"

    class DataErrors:
        def __init__(self, x=0) -> None:
            self.x = x
        def __call__(self) -> None:
            self.x += 1

    data_errors = DataErrors()

    def _calculate(x):
        return calculate(x, pt, aunit)

    _map = lambda x: [(i.strip(";").split(",") if mode == "reg" else i.strip(";")) for i in (re.findall(f"{re1},{re1};?", x) if mode == "reg" else re.findall(f"{re1};?", x))]
    _join = lambda x: xy_map.extend(x.result())
    
    xy_map = []
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(_map, i) for i in [_expr]]
        for future in futures:
            future.add_done_callback(_join)
    xy_map = [([str(i), str(j)] if mode == "reg" else str(j)) for i, j in (history.values() if mode == "reg" else enumerate(history.values()))] + xy_map

    def _man(data):
        if mode == "reg":
            (x, _), (y, _) = list(map(_calculate, data))
            return x, y
        return _calculate(data)[0]
        
    def clean(future):
        if mode == "reg":
            _x, _y = future.result()
            if not ("Error" in (_x, _y)):
                x.append(_x); y.append(_y)
            else:
                data_errors()
        else:
            _x = future.result()
            if _x != "Error":
                x.append(_x)
            else:
                data_errors()
            
    x, y = [], []
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(_man, i) for i in xy_map]
        for future in futures:
            future.add_done_callback(clean)
    
    if data_errors.x > 0: return JsonResponse({"data": "Error xx"})
    
    try:
        if mode == "reg":
            reg_mode = request.POST["regMode"].lower()
            keys = globals()[reg_mode+"_reg"](x,y).keys()
            values = globals()[reg_mode+"_reg"](x,y).values()
            _data_ = {key: value for key, value in zip(keys, np.array(list(values)).tolist())}
        else:
            _data_ = stdevn(x)
    except Exception as e:
        _data_ = str(e) #"Error"   
    return JsonResponse({"data": _data_, "history": {i:j for i, j in (enumerate(zip(x, y)) if mode == "reg" else enumerate(x))}, "xymap": xy_map})
    
    