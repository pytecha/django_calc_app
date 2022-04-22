$(() => {
	"use strict";
	const shiftToggles = "reciprocal factorial combination-func permutation-func polar-func rec-func cube cbrt zero rnd dot rand equals nav-left nav-home nav-right nav-end base-mode clear-mode proper-frac improper-frac exponent x-root log antilog ln antiln degree-entry sexa-convert sin arcsin cos arcos tan arctan rcl sto eng dis-eng comma semicolon minusm del ins acbtn plusm power-off pow10 pi ans drg percent";
	const alphaToggles = "polar-func colon ln e-base-value dash lttra degree-entry lttrb hyp lttrc sin lttrd cos lttre tan lttrf r-parenthesis lttrx comma lttry plusm lttrm";

	function anyModeActive() {
		return ($("#power-off").data("active") || $("#base-mode").data("progress") > 0 || $("#clear-mode").data("state") > 0 || $(".calc-display").data("error") || $(".calc-display").data("dispset") || $(".calc-display").data("contset") || $("#ireg").data("view") > 0 || $("#ssum").data("sdstate") === 1 || $("#svar").data("sdstate") === 1 || $("#ssum").data("regstate") === 1 || $("#svar").data("regstate") === 1);
	}

	function toggleState(ids) {
		for (let id of ids.split(" ")) {
			if ($("#" + id).data("active")) {
				$("#" + id).data("active", false);
			} else {
				$("#" + id).data("active", true);
			}
			if (id.startsWith("i") && id != "ins") {
				$("#" + id).toggleClass(id + "-active").toggleClass(id + "-passive");
			} else {
				$("#i" + id).toggleClass("i" + id + "-active").toggleClass("i" + id + "-passive");
			}
		}
	}

	const calcIndicators = "ishift ialpha ihyp iins isto ircl ilttrm isd ireg iconvd iconvg iconvr ifix isci inorm";

	function shift() {
		if ($("#isd").data("active") || $("#ireg").data("active")) {
			let ids = "cldt data one two ssum svar".split(" ").concat(shiftToggles.split(" "));
			for (let id of ids) {
				if (["plusm", "minusm"].includes(id)) {
					continue;
				}
				$("#" + id).toggle();
			}
		} else {
			for (let id of shiftToggles.split(" ")) {
				$("#" + id).toggle();
			}
		}
	}

	function alpha() {
		if ($("#isd").data("active") || $("#ireg").data("active")) {
			for (let id of["data"].concat(alphaToggles.split(" "))) {
				if (id == "plusm") {
					continue;
				}
				$("#" + id).removeClass("text-success text-primary bg-secondary bg-opacity-50 fw-bold").toggle();
			}
		} else {
			for (let id of alphaToggles.split(" ")) {
				$("#" + id).removeClass("text-success text-primary bg-secondary bg-opacity-50 fw-bold").toggle();
			}
		}
		$("#data").addClass("text-primary bg-secondary bg-opacity-50 fw-bold");
	}

	function hyp() {
		if ($("#shift").data("active")) {
			$("#arcsin,#arcsinh,#arcos,#arcosh,#arctan,#arctanh").toggle();
		} else {
			$("#sin,#sinh,#cos,#cosh,#tan,#tanh").toggle();
		}
		if ($("#rcl").data("active")) {
			toggleState("rcl");
		}
	}

	function scrollInput() {
		$(".calc-input").scrollLeft($(".calc-input-left").width() - 25);
	}

	function supportModesToggle(ids = "") {
		for (let id of ids.split(" ")) {
			if (id != "hyp" && $("#hyp").data("active")) {
				hyp();
				toggleState("hyp");
			}
			if (id != "shift" && $("#shift").data("active")) {
				shift();
				toggleState("shift");
			}
			if (id != "alpha" && $("#alpha").data("active")) {
				alpha();
				toggleState("alpha");
			}
			if (id != "rcl" && $("#rcl").data("active")) {
				rcl();
				toggleState("rcl");
			}
			if (id != "sto" && $("#sto").data("active")) {
				sto();
				toggleState("sto");
			}
		}
	}

	function setValue(input, extra = "") {
		if (!(anyModeActive())) {
			supportModesToggle();
			if ($("#ins").data("active")) {
				$(".calc-input-left").append(input.split("**"));
				$(".calc-input-right").prepend(extra);
			} else {
				$(".calc-input-right > span").first().remove();
				$(".calc-input-left").append(input.split("**"));
				$(".calc-input-right").prepend(extra);
			}
			scrollInput();
		}
		$(".calc-input > div").children().filter(function() {
			return ["l-parenthesis", "r-parenthesis"].includes($(this).data("id"));
		}).css({
			position: "relative",
			bottom: "0.15rem"
		});
	}

	function opposeState(ids) {
		for (let id of ids.split(" ")) {
			if ($("#" + id).data("active")) {
				$("#" + id).removeClass(id + "-active").addClass(id + "-passive");
				$("#" + id).data("active", false);
			}
		}
	}

	function affirmState(ids) {
		for (let id of ids.split(" ")) {
			if (!($(id).data("active"))) {
				$("#" + id).addClass(id + "-active").removeClass(id + "-passive");
				$("#" + id).data("active", true);
			}
		}
	}

	function calcHome() {
		$(".mode-id-1").show();
		$(".mode-text-1").removeClass("fs-1");
		$(".calc-show-mode,.calc-show-mode > div").animate({
				opacity: 0
			},
			400).css({
			display: "none"
		});
		$(".show-first").removeClass("w-75 m-auto");
		$(".calc-input,.calc-indicators").css("display",
			"flex").animate({
				opacity: 1
			},
			800);
		$(".calc-output").show().animate({
				opacity: 1
			},
			800);
		$("#base-mode").data("progress",
			0);
		$("#ireg").data("view",
			0);
		$(".mode-text-2").removeClass("px-0").addClass("p-2");
		$(".scroll-hint > div").hide();
	}

	function bgContrast(side) {
		if (side == "left") {
			const currentDepth = $(".calc-display").data("colorDepth");
			const newDepth = currentDepth + 5;
			if (newDepth <= 255) {
				$(".calc-display").data("colorDepth", newDepth).css({
					backgroundColor: `rgb(${newDepth},${newDepth},${newDepth})`
				});
				$(".calc-show-mode").css({
					backgroundColor: `rgb(${newDepth},${newDepth},${newDepth})`
				});
			}
		} else {
			const currentDepth = $(".calc-display").data("colorDepth");
			const newDepth = currentDepth - 5;
			if (newDepth >= 0) {
				$(".calc-display").data("colorDepth", newDepth).css({
					backgroundColor: `rgb(${newDepth},${newDepth},${newDepth})`
				});
				$(".calc-show-mode").css({
					backgroundColor: `rgb(${newDepth},${newDepth},${newDepth})`
				});
			}
		}
		if ($(".calc-display").data("colorDepth") < 150) {
			$(".calc-show-mode").css("border-color", "transparent");
			$(".mode-text-1").css({
				backgroundColor: "rgba(0,0,0,0.75)",
				color: "lightgray"
			});
			$(".calc-show-mode > div > div:not('.mode-text-1')").css({
				color: "lightgray"
			});
		} else {
			$(".calc-show-mode").css("border-color", "#f0ad4e");
			$(".mode-text-1").css({
				backgroundColor: "#f0ad4e",
				color: "black"
			});
			$(".calc-show-mode > div > div:not('.mode-text-1')").css({
				color: "black"
			});
		}
	}

	function opposeSD() {
		$("#data").hide();
		$("#plusm").show();
	}
	//const opposeREG = opposeSD;

	function affirmSD() {
		$("#plusm").hide();
		$("#data").show();
	}
	const affirmREG = affirmSD;

	function rcl() {
		if ($("#ireg").data("active") || $("#isd").data("active")) {
			for (let id of alphaToggles.split(" ").concat(["data"])) {
				if ("polar-func colon ln e-base-value plusm".split(" ").includes(id)) {
					continue;
				}
				if (id.startsWith("lttr")) {
					$("#" + id).addClass("text-success bg-secondary bg-opacity-50 fw-bold").removeClass("text-primary");
				}
				$("#" + id).toggle();
			}
		} else {
			for (let id of alphaToggles.split(" ")) {
				if ("polar-func colon ln e-base-value".split(" ").includes(id)) {
					continue;
				}
				if (id.startsWith("lttr")) {
					$("#" + id).addClass("text-success bg-secondary bg-opacity-50 fw-bold").removeClass("text-primary");
				}
				$("#" + id).toggle();
			}
		}
	}

	function sto() {
		if ($("#ireg").data("active") || $("#isd").data("active")) {
			for (let id of "dash lttra sexa-convert lttrb hyp lttrc arcsin lttrd arcos lttre arctan lttrf r-parenthesis lttrx semicolon lttry cldt lttrm".split(" ")) {
				if (id.startsWith("lttr")) {
					$("#" + id).addClass("text-primary bg-secondary bg-opacity-50 fw-bold").removeClass("text-success");
				}
				$("#" + id).toggle();
			}
		} else {
			for (let id of "dash lttra sexa-convert lttrb hyp lttrc arcsin lttrd arcos lttre arctan lttrf r-parenthesis lttrx semicolon lttry minusm lttrm".split(" ")) {
				if (id.startsWith("lttr")) {
					$("#" + id).addClass("text-primary bg-secondary bg-opacity-50 fw-bold").removeClass("text-success");
				}
				$("#" + id).toggle();
			}
		}
	}

	function animArrows() {
		const el = $(".scroll-hint");
		const newone = el.clone(true);
		el.before(newone).remove();
		newone.children().show();
	}

	function regModeView(category, view) {
		return $("#" + category).data("regstate") === 1 && ($("#ireg").data("linView") === view || $("#ireg").data("logView") === view || $("#ireg").data("expView") === view || $("#ireg").data("pwrView") === view || $("#ireg").data("invView") === view || $("#ireg").data("quadView") === view);
	}

	function regModeViewReset() {
		for (const modeView of "linView logView expView pwrView invView quadView".split(" ")) {
			$("#ireg").data(modeView, 0);
		}
	}
	
	function recalculate() {
	    if ($(".calc-input > div").children().length > 0) {
	        setTimeout(() => {
	            $("#equals").trigger("click");
	        }, 200);
	    }
	}

	//power-on click
	$("#power-on").click(() => {
		$("#power-off").data("active", false);
		supportModesToggle();
		$("#clear-mode,#drg").data("state", 0);
		$(".calc-display").data({
			contset: false,
			error: false,
			dispset: false
		});
		$("#ireg").data("view", 0);
		$("#base-mode").data("progress", 0);
		$("#ssum,#svar").data({
			sdstate: 0,
			regstate: 0
		});
		$("#equals").data({Ans:0, Ans1:0, Ans2:0})
		$("#ifix,#isci,#inorm").data("setting", false);
		setTimeout(() => {
				for (let id of calcIndicators.split(" ")) {
					$("#" + id).addClass("rounded " + id + "-passive");
					if ($("#" + id).data("active")) {
						$("#" + id).removeClass(id + "-passive").addClass(id + "-active");
					}
				}
				let bgCD = $(".calc-display").data("colorDepth");
				$(".calc-input").children().html("");
				$(".calc-output-main").html("0");
				$(".calc-indicators").removeClass("d-none").show();
				$(".calc-display,.calc-show-mode").css("background-color",
					`rgb(${bgCD},${bgCD},${bgCD})`);
				calcHome();
				$(".calc-input,.calc-input > div").css("display", "flex");
				if ($("#ireg").data("active") || $("#isd").data("active")) {
					affirmSD();
				}
			},
			150);
		setTimeout(() => {
				//let _a = 6;
			},
			1000);

	});

	//power-off click
	$("#power-off").click(() => {
		supportModesToggle();
		calcHome();
		$(".calc-input,.calc-input-left,.calc-output,.calc-indicators").css("display",
			"none");
		$(".calc-display,.calc-show-mode").css("background-color",
			"white");

		for (let id of calcIndicators.split(" ")) {
			$("#" + id).removeClass(id + "-active").removeClass(id + "-passive");
		}
		setTimeout(() => {
				//let _b = 6;
			},
			300);
		opposeSD(); // or opposeREG()
		toggleState("power-off");
	});

	//shift click
	$("#shift").click(() => {
		if (!(anyModeActive())) {
			supportModesToggle("shift");
			shift();
			toggleState("shift");
		}
	});

	//alpha click
	$("#alpha").click(() => {
		if (!(anyModeActive())) {
			supportModesToggle("alpha");
			alpha();
			toggleState("alpha");
		}
	});

	//hyp click
	$("#hyp").click(() => {
		if (!(anyModeActive())) {
			hyp();
			toggleState("hyp");
		}
	});

	//Ins click
	$("#ins").click(() => {
		if (!(anyModeActive())) {
			supportModesToggle();
			toggleState("ins");
		}
	});

	$("#equals").click(() => {
		if (!(anyModeActive())) {
			supportModesToggle();;
		}
	});
	
	//rcl click
	$("#rcl").click(() => {
		if (!(anyModeActive())) {
			supportModesToggle("rcl");
			rcl();
			toggleState("rcl");
		}
	});

	//sto click
	$("#sto").click(() => {
		if (!(anyModeActive())) {
			if ($("#hyp").data("active")) {
				hyp();
				toggleState("hyp");
			}
			sto();
			toggleState("sto");
		}
	});

	//del click
	$("#del").click(() => {
		if (!(anyModeActive())) {
			$(".calc-input-left > span").last().remove();
			scrollInput();
		}
	});

	$("#rnd").click(() => {
		if (!(anyModeActive())) {
			supportModesToggle();
			recalculate();
		}
	});

	//ac click
	$("#acbtn").click(() => {
		if (!($("#power-off").data("active"))) {
			supportModesToggle();
			$(".calc-display").data({
				error: false,
				contset: false
			});
			$(".calc-input").children().html("");
			$(".calc-output-main").html("0");
			$("#clear-mode,#drg").data("state", 0);
			$(".calc-display").data({
				contset: false,
				error: false,
				dispset: false
			});
			$("#ifix,#isci,#inorm").data("setting", false);
			$("#ireg").data("view", 0);
			$("#base-mode").data("progress", 0);
			$("#iconvd").data("active", true);
			$("#ssum,#svar").data({
				sdstate: 0,
				regstate: 0
			});
			calcHome();
		}
	});

	//calc-input click
	$(".calc-input").click((e) => {
		function element(infL, supL) {
			if (Math.abs(e.pageX - infL[0].offset) < Math.abs(supL[0].offset - e.pageX)) {
				return infL[0].element;
			}
			return supL[0].element;
		}
		if (!(anyModeActive())) {
			let infL = [];
			let supL = [];
			$(".calc-input > div > span").each(function() {
				if (($(this).offset().left + $(this).width()) > e.pageX) {
					supL.push({
						element: $(this),
						offset: $(this).offset().left + $(this).width()
					});
				} else {
					infL.push({
						element: $(this),
						offset: $(this).offset().left + $(this).width()
					});
				}
			});
			infL = infL.sort((a, b) => b.offset - a.offset);
			supL = supL.sort((a, b) => a.offset - b.offset);
			switch (true) {
				case typeof supL[0] == "undefined":
					$(".calc-input-left").append($(".calc-input-right").children());
					break;
				case typeof infL[0] == "undefined":
					$(".calc-input-right").prepend($(".calc-input-left").children());
					break;
				case $(".calc-input-right").offset().left >= e.pageX:
					$(".calc-input-right").prepend(element(infL, supL).nextAll());
					break;
				default:
					const elements = [];
					element(infL, supL).next().prevAll().each(function() {
						elements.unshift($(this));
					});
					$(".calc-input-left").append(elements);
			}
		}
	});

	//nav-left click
	$("#nav-left").click(() => {
		switch (true) {
			case $("#ireg").data("view") === 2:
				$(".mode-text-1").html("Lin");
				$(".mode-text-2").html("Log");
				$(".mode-text-3").html("Exp");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("view", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("linView", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("logView", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("expView", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("pwrView", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("invView", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("quadView", 1);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 3:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				animArrows();
				$("#ireg").data("quadView", 2);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 2:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("linView", 1);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("linView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 4:
				$(".show-third").show();
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("linView", 3);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 2:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("logView", 1);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("logView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 4:
				$(".show-third").show();
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("logView", 3);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 2:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("expView", 1);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("expView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 4:
				$(".show-third").show();
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("expView", 3);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 2:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("pwrView", 1);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("pwrView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 4:
				$(".show-third").show();
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("pwrView", 3);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 2:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("invView", 1);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("invView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 4:
				$(".show-third").show();
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("invView", 3);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 2:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("quadView", 1);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("quadView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 4:
				$(".show-third").show();
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>C</span>");
				animArrows();
				$("#ireg").data("quadView", 3);
				break;

			case $(".calc-display").data("contset"):
				bgContrast("left");
				break;
			default:
				if (!(anyModeActive())) {
					if ($(".calc-input-left").children().length > 0) {
						$(".calc-input-right").prepend($(".calc-input-left > span").last());
						scrollInput();
					}
				}
		}
	});

	//nav-home click
	$("#nav-home").click(() => {
		if (!(anyModeActive())) {
			$(".calc-input-right").prepend($(".calc-input-left").children());
			$(".calc-input").scrollLeft(0);
			supportModesToggle();
		}
	});

	//nav-right click
	$("#nav-right").click(() => {
		switch (true) {
			case $("#ireg").data("view") === 1:
				$(".mode-text-1").html("Pwr");
				$(".mode-text-2").html("Inv");
				$(".mode-text-3").html("Quad");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("view", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 1:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("linView", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 1:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("logView", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 1:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("expView", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 1:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("pwrView", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 1:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("invView", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 1:
				$(".mode-text-1").html("<span>&#931;y<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;y</span>");
				$(".mode-text-3").html("<span>&#931;xy</span>");
				animArrows();
				//$(".sh-left,.sh-right").hide().show();
				$("#ireg").data("quadView", 2);
				break;
			case $("#ssum").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 2:
				$(".mode-text-1").html("<span>&#931;x<sup>3</sup></span>");
				$(".mode-text-2").html("<span>&#931;x<sup>2</sup>y</span>");
				$(".mode-text-3").html("<span>&#931;x<sup>4</sup></span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("quadView", 3);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 1:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("linView", 2);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 2:
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("linView", 3);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Lin" && $("#ireg").data("linView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg></span>");
				$(".mode-text-2").html("<span><svg class=\"icon icon-y-hat\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				$(".show-third,.sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("linView", 4);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 1:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("logView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 2:
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("logView", 3);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Log" && $("#ireg").data("logView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg></span>");
				$(".mode-text-2").html("<span><svg class=\"icon icon-y-hat\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				$(".show-third,.sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("logView", 4);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 1:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("expView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 2:
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("expView", 3);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Exp" && $("#ireg").data("expView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg></span>");
				$(".mode-text-2").html("<span><svg class=\"icon icon-y-hat\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				$(".show-third,.sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("expView", 4);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 1:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("pwrView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 2:
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("pwrView", 3);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Pwr" && $("#ireg").data("pwrView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg></span>");
				$(".mode-text-2").html("<span><svg class=\"icon icon-y-hat\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				$(".show-third,.sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("pwrView", 4);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 1:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("invView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 2:
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>r</span>");
				animArrows();
				$("#ireg").data("invView", 3);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Inv" && $("#ireg").data("invView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg></span>");
				$(".mode-text-2").html("<span><svg class=\"icon icon-y-hat\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				$(".show-third,.sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("invView", 4);
				break;

			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 1:
				$(".mode-text-1").html("<span><svg class=\"icon icon-y-bar\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;y</span>");
				$(".mode-text-3").html("<span><b>s</b>y</span>");
				animArrows();
				$("#ireg").data("quadView", 2);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 2:
				$(".mode-text-1").html("<span>A</span>");
				$(".mode-text-2").html("<span>B</span>");
				$(".mode-text-3").html("<span>C</span>");
				animArrows();
				$("#ireg").data("quadView", 3);
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("regMode") == "Quad" && $("#ireg").data("quadView") === 3:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg>1</span>");
				$(".mode-text-2").html("<span><svg class=\"icon icon-x-hat\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg>2</span>");
				$(".mode-text-3").html("<span><svg class=\"icon icon-y-hat\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				$(".sh-right").hide();
				$(".sh-left").show();
				$("#ireg").data("quadView", 4);
				break;

			case $(".calc-display").data("contset"):
				bgContrast("right");
				break;
			default:
				if (!(anyModeActive())) {
					if ($(".calc-input-right").children().length > 0) {
						$(".calc-input-left").append($(".calc-input-right > span").first());
						scrollInput();
					}
				}
		}
	});

	//nav-end click
	$("#nav-end").click(() => {
		if (!(anyModeActive())) {
			$(".calc-input-left").append($(".calc-input-right").children());
			$(".calc-input").scrollLeft($(".calc-input-left").width() + 25);
			supportModesToggle();
		}
	});

	//base-mode click
	$("#base-mode").click(() => {
		if (!($("#power-off").data("active") || $("#clear-mode").data("state") > 0 || $(".calc-display").data("error") || $("#ssum").data("sdstate") === 1 || $("#ssum").data("regstate") === 1 || $("#svar").data("sdstate") === 1 || $("#svar").data("regstate") === 1 || $("#ifix").data("setting") || $("#isci").data("setting") || $("#inorm").data("setting"))) {
			supportModesToggle();
			let progress = $("#base-mode").data("progress");
			let view = $("#ireg").data("view");
			switch (true) {
				case $(".calc-display").data("contset"):
					$(".calc-display").data({
						contset: false
					});
					calcHome();
					break;
				case $(".calc-display").data("error"):
					console.log("output error");
					break;
				case view === 1:
				case view === 2:
					calcHome();
					break;
				case progress === 0:
					$(".mode-text-1").html("COMP");
					$(".mode-text-2").html("SD");
					$(".mode-text-3").html("REG");
					$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
						opacity: 0
					}, 400).css("display", "none");
					$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
						opacity: 0,
						display: "flex"
					}).animate({
						opacity: 1
					}, 600);
					$("#base-mode").data("progress", 1);
					break;
				case progress === 1:
					$(".mode-text-1").html("Deg");
					$(".mode-text-2").html("Rad");
					$(".mode-text-3").html("Gra");
					$("#base-mode").data("progress", 2);
					break;
				case progress === 2:
					$(".mode-text-1").html("Fix");
					$(".mode-text-2").html("Sci");
					$(".mode-text-3").html("Norm");
					$("#base-mode").data("progress", 3);
					break;
				case progress === 3:
					let html = String.raw `<div class="px-0 d-flex justify-content-between"><svg class="icon me-2" style="transform:rotate(180deg);"><use xlink:href="#icon-arrow-head-right" href="#icon-arrow-head-right"></use></svg>
                    CONT
                    <svg class="icon ms-2"><use xlink:href="#icon-arrow-head-right" href="#icon-arrow-head-right"></use></svg></div>`;
					$(".show-third").hide();
					$(".mode-text-1").html("Disp");
					$(".mode-text-2").removeClass("p-2").addClass("px-0").html(html);
					$("#base-mode").data("progress", 4);
					break;
				case progress === 4:
					calcHome();
					break;
				default:
					console.log("base mode switch");
			}
		}
	});

	//clear-mode click
	$("#clear-mode").click(() => {
		supportModesToggle();
		switch (true) {
			case $("#ireg").data("active"):
			case $("#isd").data("active"):
				$(".mode-text-1").html("Scl");
				$(".mode-text-2").html("Mode");
				$(".mode-text-3").html("All");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not(".show-forth,.contrast,.on-error").css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$("#clear-mode").data("state", 1);
				break;
			case $("#clear-mode").data("state") === 0:
				$(".mode-text-1").html("Mcl");
				$(".mode-text-2").html("Mode");
				$(".mode-text-3").html("All");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not(".show-forth,.contrast,.on-error").css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$("#clear-mode").data("state", 1);
				break;
			case 1:
				$("#clear-mode").data("state", 0);
				calcHome();
				break;
		}

	});

	//ssum click
	$("#ssum").click(() => {
		supportModesToggle();
		switch (true) {
			case $("#isd").data("active") && $("#ssum").data("sdstate") === 0:
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not(".show-forth,.contrast,.on-error").css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$("#ssum").data("sdstate", 1);
				break;
			case $("#ireg").data("active") && $("#ssum").data("regstate") === 0 && $("#ireg").data("regMode") == "Lin":
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ssum").data("regstate", 1);
				$("#ireg").data("linView", 1);
				break;
			case $("#ireg").data("active") && $("#ssum").data("regstate") === 0 && $("#ireg").data("regMode") == "Log":
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ssum").data("regstate", 1);
				$("#ireg").data("logView", 1);
				break;
			case $("#ireg").data("active") && $("#ssum").data("regstate") === 0 && $("#ireg").data("regMode") == "Exp":
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ssum").data("regstate", 1);
				$("#ireg").data("expView", 1);
				break;
			case $("#ireg").data("active") && $("#ssum").data("regstate") === 0 && $("#ireg").data("regMode") == "Pwr":
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ssum").data("regstate", 1);
				$("#ireg").data("pwrView", 1);
				break;
			case $("#ireg").data("active") && $("#ssum").data("regstate") === 0 && $("#ireg").data("regMode") == "Inv":
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ssum").data("regstate", 1);
				$("#ireg").data("invView", 1);
				break;
			case $("#ireg").data("active") && $("#ssum").data("regstate") === 0 && $("#ireg").data("regMode") == "Quad":
				$(".mode-text-1").html("<span>&#931;x<sup>2</sup></span>");
				$(".mode-text-2").html("<span>&#931;x</span>");
				$(".mode-text-3").html("<span>n</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ssum").data("regstate", 1);
				$("#ireg").data("quadView", 1);
				break;
			default:
				$("#ssum").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
		}
	});

	//svar click
	$("#svar").click(() => {
		supportModesToggle();
		switch (true) {
			case $("#isd").data("active") && $("#svar").data("sdstate") === 0:
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not(".show-forth,.contrast,.on-error").css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$("#svar").data("sdstate", 1);
				break;
			case $("#ireg").data("active") && $("#svar").data("regstate") === 0 && $("#ireg").data("regMode") == "Lin":
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#svar").data("regstate", 1);
				$("#ireg").data("linView", 1);
				break;
			case $("#ireg").data("active") && $("#svar").data("regstate") === 0 && $("#ireg").data("regMode") == "Log":
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#svar").data("regstate", 1);
				$("#ireg").data("logView", 1);
				break;
			case $("#ireg").data("active") && $("#svar").data("regstate") === 0 && $("#ireg").data("regMode") == "Exp":
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#svar").data("regstate", 1);
				$("#ireg").data("expView", 1);
				break;
			case $("#ireg").data("active") && $("#svar").data("regstate") === 0 && $("#ireg").data("regMode") == "Pwr":
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#svar").data("regstate", 1);
				$("#ireg").data("pwrView", 1);
				break;
			case $("#ireg").data("active") && $("#svar").data("regstate") === 0 && $("#ireg").data("regMode") == "Inv":
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#svar").data("regstate", 1);
				$("#ireg").data("invView", 1);
				break;
			case $("#ireg").data("active") && $("#svar").data("regstate") === 0 && $("#ireg").data("regMode") == "Quad":
				$(".mode-text-1").html("<span><svg class=\"icon icon-x-bar\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				$(".mode-text-2").html("<span>&#963;x</span>");
				$(".mode-text-3").html("<span><b>s</b>x</span>");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not('.show-forth,.contrast,.on-error').css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#svar").data("regstate", 1);
				$("#ireg").data("quadView", 1);
				break;
			default:
				$("#svar").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
		}
	});

	//drg click
	$("#drg").click(() => {
		supportModesToggle();
		switch ($("#drg").data("state")) {
			case 0:
				$(".mode-text-1").html("D");
				$(".mode-text-2").html("R");
				$(".mode-text-3").html("G");
				$(".calc-input,.calc-output,.calc-indicators,.contrast,.on-error").animate({
					opacity: 0
				}, 400).css("display", "none");
				$(".calc-show-mode,.calc-show-mode > div").not(".show-forth,.contrast,.on-error").css({
					opacity: 0,
					display: "flex"
				}).animate({
					opacity: 1
				}, 600);
				$("#drg").data("state", 1);
				break;
			case 1:
				$("#drg").data("state", 0);
				calcHome();
				break;
		}

	});

	//values entry
	$("#zero").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 0
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 0
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"zero\">0</span>");
		}
	});
	$("#one").click(() => {
		const progress = $("#base-mode").data("progress");
		const view = $("#ireg").data("view");
		const clrState = $("#clear-mode").data("state");
		const drgState = $("#drg").data("state");
		switch (true) {
			case progress === 1:
				$("#power-on").trigger("click");
				opposeSD();
				opposeState("ireg isd");
				break;
			case progress === 2:
				opposeState("iconvr iconvg");
				affirmState("iconvd");
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 1
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 1
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#inorm").data("setting"):
				opposeState("ifix isci");
				affirmState("inorm");
				$("#inorm").data({
					setting: false,
					option: 1
				});
				recalculate();
				calcHome();
				break;
			case progress === 3:
				$(".show-second,.show-third,.mode-id-1").hide();
				$(".mode-text-1").html("Fix 0~9 ?").addClass("fs-1");
				$(".show-first").addClass("w-75 m-auto");
				$("#ifix").data("setting", true);
				break;
			case progress === 4:
				$(".calc-show-mode > div").css("width", "22.5%");
				$(".mode-text-1").html("<b>a</b>b/c");
				$(".mode-text-2").html("d/c");
				$(".mode-text-3").html("Dot");
				$(".mode-text-4").html("Comma");
				$(".show-third,.show-forth").show().css({
					display: "flex",
					opacity: 1
				});
				$(".calc-display").data("dispset", true);
				$("#base-mode").data("progress", 0);
				break;
			case view === 1:
				opposeState("isd");
				affirmState("ireg");
				$("#ireg").data("regMode", "Lin");
				regModeViewReset();
				calcHome();
				affirmREG();
				$("#power-on").trigger("click");
				break;
			case view === 2:
				opposeState("isd");
				affirmState("ireg");
				$("#ireg").data("regMode", "Pwr");
				regModeViewReset();
				calcHome();
				affirmREG();
				$("#power-on").trigger("click");
				break;
			case clrState === 1 && ($("#isd").data("active") || $("#ireg").data("active")):
				$("#clear-mode").data("state", 0);
				$(".calc-input-left").html("Stat Clear ?");
				$(".calc-input-right").html("");
				calcHome();
				break;
			case clrState === 1:
				$("#clear-mode").data("state", 0);
				$(".calc-input-left").html("Mem Clear ?");
				$(".calc-input-right").html("");
				calcHome();
				break;
			case $("#ssum").data("sdstate") === 1 || regModeView("ssum", 1):
				$("#ssum").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-x2\">&#931;x<sup>2</sup></span>");
				break;
			case regModeView("ssum", 2):
				$("#ssum").data("regstate", 0);
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-y2\">&#931;y<sup>2</sup></span>");
				break;
			case regModeView("ssum", 3):
				$("#ssum").data("regstate", 0);
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-x3\">&#931;x<sup>3</sup></span>");
				break;
			case $("#svar").data("sdstate") === 1 || regModeView("svar", 1):
				$("#svar").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
				setValue("<span data-id=\"x-bar\"><svg class=\"icon-x-bar-in\"><use xlink:href=\"#icon-x-bar\" href=\"#icon-x-bar\"></use></svg></span>");
				break;
			case regModeView("svar", 2):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"y-bar\"><svg class=\"icon-y-bar-in\"><use xlink:href=\"#icon-y-bar\" href=\"#icon-y-bar\"></use></svg></span>");
				break;
			case regModeView("svar", 3):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"coef-a\">A</span>");
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("quadView") === 4:
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"x-hat\"><svg class=\"icon-x-hat-in\" style=\"position:relative;left:0.15rem;\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg><span style=\"font-size:20px;font-weight:bolder;position:relative;right:0.35rem;\">1</span></span>");
				break;
			case regModeView("svar", 4):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"x-hat\"><svg class=\"icon-x-hat-in\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg></span>");
				break;
			case drgState === 1:
				$("#drg").data("state", 0);
				calcHome();
				setValue("<span data-id=\"deg\"><sup>o</sup></span>");
				break;
			case $(".calc-display").data("dispset"):
				$(".calc-display").data({
					dispset: false,
					disp: "mixedfrac"
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"one\">1</span>");
		}
		$(".calc-input").scrollLeft($(".calc-input-left").width() + 25);
	});

	$("#two").click(() => {
		const progress = $("#base-mode").data("progress");
		const view = $("#ireg").data("view");
		const clrState = $("#clear-mode").data("state");
		const drgState = $("#drg").data("state");
		switch (true) {
			case progress === 1:
				opposeState("ireg");
				affirmState("isd");
				affirmSD();
				calcHome();
				$("#power-on").trigger("click");
				break;
			case progress === 2:
				opposeState("iconvd iconvg");
				affirmState("iconvr");
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 2
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 2
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#inorm").data("setting"):
				opposeState("ifix isci");
				affirmState("inorm");
				$("#inorm").data({
					setting: false,
					option: 2
				});
				recalculate();
				calcHome();
				break;
			case progress === 3:
				$(".show-second,.show-third,.mode-id-1").hide();
				$(".mode-text-1").html("Sci 0~9 ?").addClass("fs-1");
				$(".show-first").addClass("w-75 m-auto");
				$("#isci").data("setting", true);
				break;
			case progress === 4:
				$(".calc-show-mode > div").not('.contrast').css("display", "none");
				$(".contrast").css({
					opacity: 1,
					display: "flex"
				});
				$("#base-mode").data("progress", 0);
				$(".calc-display").data("contset", true);
				break;
			case view === 1:
				opposeState("isd");
				affirmState("ireg");
				$("#ireg").data("regMode", "Log");
				regModeViewReset();
				calcHome();
				affirmREG();
				$("#power-on").trigger("click");
				break;
			case view === 2:
				opposeState("isd");
				affirmState("ireg");
				$("#ireg").data("regMode", "Inv");
				regModeViewReset();
				affirmREG();
				calcHome();
				$("#power-on").trigger("click");
				break;
			case clrState === 1 && ($("#isd").data("active") || $("#ireg").data("active")):
			case clrState === 1:
				$("#clear-mode").data("state", 0);
				$(".calc-input-left").html("Mode Clear ?");
				$(".calc-input-right").html("");
				calcHome();
				break;
			case $("#ssum").data("sdstate") === 1 || regModeView("ssum", 1):
				$("#ssum").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-x\">&#931;x</span>");
				break;
			case regModeView("ssum", 2):
				$("#ssum").data("regstate", 0);
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-y\">&#931;y</span>");
				break;
			case regModeView("ssum", 3):
				$("#ssum").data("regstate", 0);
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-x2y\">&#931;x<sup>2</sup>y</span>");
				break;
			case $("#svar").data("sdstate") === 1 || regModeView("svar", 1):
				$("#svar").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
				setValue("<span data-id=\"std-x\">&#963;x</span>");
				break;
			case regModeView("svar", 2):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"std-y\">&#963;y</span>");
				break;
			case regModeView("svar", 3):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"coef-b\">B</span>");
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("quadView") === 4:
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"x-hat\"><svg class=\"icon-x-hat-in\" style=\"position:relative;left:0.15rem;\"><use xlink:href=\"#icon-x-hat\" href=\"#icon-x-hat\"></use></svg><span style=\"font-size:20px;font-weight:bolder;position:relative;right:0.3rem;\">2</span></span>");
				break;
			case regModeView("svar", 4):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"y-hat\"><svg class=\"icon-y-hat-in\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				break;
			case drgState === 1:
				$("#drg").data("state", 0);
				calcHome();
				setValue("<span data-id=\"rad\"><sup>r</sup></span>");
				break;
			case $(".calc-display").data("dispset"):
				$(".calc-display").data({
					dispset: false,
					disp: "impfrac"
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"two\">2</span>");
		}
		$(".calc-input").scrollLeft($(".calc-input-left").width() + 25);
	});

	$("#three").click(() => {
		const progress = $("#base-mode").data("progress");
		const view = $("#ireg").data("view");
		const clrState = $("#clear-mode").data("state");
		const drgState = $("#drg").data("state");
		switch (true) {
			case progress === 1:
				$(".mode-text-1").html("Lin");
				$(".mode-text-2").html("Log");
				$(".mode-text-3").html("Exp");
				$(".sh-left").hide();
				$(".sh-right").show();
				$("#ireg").data("view", 1);
				$("#base-mode").data("progress", 0);
				break;
			case progress === 2:
				opposeState("iconvd iconvr");
				affirmState("iconvg");
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 3
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 3
				});
				recalculate();
				calcHome();
				break;
			case progress === 3:
				$(".show-second,.show-third,.mode-id-1").hide();
				$(".mode-text-1").html("Norm 1~2 ?").addClass("fs-1");
				$(".show-first").addClass("w-75 m-auto");
				$("#inorm").data("setting", true);
				break;
			case view === 1:
				opposeState("isd");
				affirmState("ireg");
				$("#ireg").data("regMode", "Exp");
				regModeViewReset();
				affirmREG();
				calcHome();
				$("#power-on").trigger("click");
				break;
			case view === 2:
				opposeState("isd");
				affirmState("ireg");
				$("#ireg").data("regMode", "Quad");
				regModeViewReset();
				calcHome();
				affirmREG();
				$("#power-on").trigger("click");
				break;
			case clrState === 1 && ($("#isd").data("active") || $("#ireg").data("active")):
			case clrState === 1:
				$("#clear-mode").data("state", 0);
				$(".calc-input-left").html("Reset All ?");
				$(".calc-input-right").html("");
				calcHome();
				break;
			case $("#ssum").data("sdstate") === 1 || regModeView("ssum", 1):
				$("#ssum").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
				setValue("<span data-id=\"n-obs\">n</span>");
				break;
			case regModeView("ssum", 2):
				$("#ssum").data("regstate", 0);
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-xy\">&#931;xy</span>");
				break;
			case regModeView("ssum", 3):
				$("#ssum").data("regstate", 0);
				calcHome();
				setValue("<span class=\"pe-1\" data-id=\"sum-x4\">&#931;x<sup>4</sup></span>");
				break;
			case $("#svar").data("sdstate") === 1 || regModeView("svar", 1):
				$("#svar").data({
					sdstate: 0,
					regstate: 0
				});
				calcHome();
				setValue("<span data-id=\"std-sx\">sx</span>");
				break;
			case regModeView("svar", 2):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"std-sy\">sy</span>");
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("quadView") === 3:
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"coef-c\">C</span>");
				break;
			case regModeView("svar", 3):
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"coef-r\">r</span>");
				break;
			case $("#svar").data("regstate") === 1 && $("#ireg").data("quadView") === 4:
				$("#svar").data("regstate", 0);
				calcHome();
				setValue("<span data-id=\"y-hat\"><svg class=\"icon-y-hat-in\"><use xlink:href=\"#icon-y-hat\" href=\"#icon-y-hat\"></use></svg></span>");
				break;
			case drgState === 1:
				$("#drg").data("state", 0);
				calcHome();
				setValue("<span data-id=\"grad\"><sup>g</sup></span>");
				break;
			case $(".calc-display").data("dispset"):
				$(".calc-display").data({
					dispset: false,
					disp: "dot"
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"three\">3</span>");
		}
		$(".calc-input").scrollLeft($(".calc-input-left").width() + 25);
	});
	$("#four").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case $(".calc-display").data("dispset"):
				$(".calc-display").data({
					dispset: false,
					disp: "comma"
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 4
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 4
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"four\">4</span>");
		}
	});
	$("#five").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 5
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 5
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"five\">5</span>");
		}
	});
	$("#six").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 6
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 6
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"six\">6</span>");
		}
	});
	$("#seven").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 7
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 7
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"seven\">7</span>");
		}
	});
	$("#eight").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 8
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 8
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"eight\">8</span>");
		}
	});
	$("#nine").click(() => {
		const progress = $("#base-mode").data("progress");
		switch (true) {
			case progress === 3 && $("#ifix").data("setting"):
				opposeState("isci inorm");
				affirmState("ifix");
				$("#ifix").data({
					setting: false,
					option: 9
				});
				recalculate();
				calcHome();
				break;
			case progress === 3 && $("#isci").data("setting"):
				opposeState("ifix inorm");
				affirmState("isci");
				$("#isci").data({
					setting: false,
					option: 9
				});
				recalculate();
				calcHome();
				break;
			default:
				setValue("<span data-id=\"nine\">9</span>");
		}
	});
	$("#dot").click(() => setValue("<span data-id=\"dot\">.</span>"));
	$("#plus").click(() => setValue("<span data-id=\"plus\">+</span>"));
	$("#minus").click(() => setValue("<span data-id=\"minus\">-</span>"));
	$("#divide").click(() => setValue("<span data-id=\"divide\">÷</span>"));
	$("#times").click(() => setValue("<span data-id=\"times\">x</span>"));
	$("#pow10").click(() => setValue("<span data-id=\"pow10\">x<span>10</span>^</span>"));
	$("#ans").click(() => setValue("<span data-id=\"ans\">Ans</span>"));
	$("#pi").click(() => setValue("<span data-id=\"pi\">π</span>"));
	$("#percent").click(() => setValue("<span data-id=\"percent\">%</span>"));
	$("#l-parenthesis").click(() => setValue("<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#r-parenthesis").click(() => setValue("<span data-id=\"r-parenthesis\">)</span>"));
	$("#comma").click(() => setValue("<span data-id=\"comma\">,</span>"));
	$("#semicolon").click(() => setValue("<span data-id=\"semicolon\">;</span>"));
	$("#plusm").click(() => setValue("<span class=\"pe-1\" data-id=\"plusm\">M+</span>"));
	$("#minusm").click(() => setValue("<span class=\"pe-1\" data-id=\"minusm\">M-</span>"));
	$("#lttrm").click(() => setValue("<span data-id=\"lttrm\">M</span>"));
	$("#lttra").click(() => setValue("<span data-id=\"lttra\">A</span>"));
	$("#lttrb").click(() => setValue("<span data-id=\"lttrb\">B</span>"));
	$("#lttrc").click(() => setValue("<span data-id=\"lttrc\">C</span>"));
	$("#lttrd").click(() => setValue("<span data-id=\"lttrd\">D</span>"));
	$("#lttre").click(() => setValue("<span data-id=\"lttre\">E</span>"));
	$("#lttrf").click(() => setValue("<span data-id=\"lttrf\">F</span>"));
	$("#lttrx").click(() => setValue("<span data-id=\"lttrx\">X</span>"));
	$("#lttry").click(() => setValue("<span data-id=\"lttry\">Y</span>"));
	$("#dash").click(() => setValue("<span data-id=\"dash\">-</span>"));
	$("#degree-entry").click(() => setValue("<span data-id=\"degree-entry\"><sup style=\"font-family:aquire;font-size:21px;\">0</sup></span>"));
	$("#sin").click(() => setValue("<span class=\"pe-1\" data-id=\"sin\">sin</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#sinh").click(() => setValue("<span class=\"pe-1\" data-id=\"sinh\">sinh</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#arcsin").click(() => setValue("<span class=\"pe-1\" data-id=\"arcsin\">sin<sup>-1</sup></span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#arcsinh").click(() => setValue("<span class=\"pe-1\" data-id=\"arcsinh\">sinh<sup>-1</sup></span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#cos").click(() => setValue("<span class=\"pe-1\" data-id=\"cos\">cos</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#cosh").click(() => setValue("<span class=\"pe-1\" data-id=\"cosh\">cosh</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#arcos").click(() => setValue("<span class=\"pe-1\" data-id=\"arcos\">cos<sup>-1</sup></span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#arcosh").click(() => setValue("<span class=\"pe-1\" data-id=\"arcosh\">cosh<sup>-1</sup></span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#tan").click(() => setValue("<span class=\"pe-1\" data-id=\"tan\">tan</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#tanh").click(() => setValue("<span class=\"pe-1\" data-id=\"tanh\">tanh</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#arctan").click(() => setValue("<span class=\"pe-1\" data-id=\"arctan\">tan<sup>-1</sup></span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#arctanh").click(() => setValue("<span class=\"pe-1\" data-id=\"arctanh\">tanh<sup>-1</sup></span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#sqrt").click(() => setValue("<span data-id=\"sqrt\">√</span>"));
	$("#square-2").click(() => setValue("<span data-id=\"square-2\"><sup>2</sup></span>"));
	$("#exponent").click(() => setValue("<span data-id=\"exponent\">^</span>"));
	$("#x-root").click(() => setValue("<span data-id=\"x-root\"><sup>x</sup>√</span>"));
	$("#log").click(() => setValue("<span class=\"pe-1\" data-id=\"log\">log</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#antilog").click(() => setValue("<span data-id=\"antilog\"><span>10</span>^</span>"));
	$("#ln").click(() => setValue("<span class=\"pe-1\" data-id=\"ln\">ln</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#rand").click(() => setValue("<span class=\"pe-1\" data-id=\"rand\">Ran#</span>"));
	$("#antiln").click(() => setValue("<span data-id=\"antiln\"><span>e</span>^</span>"));
	$("#cube").click(() => setValue("<span data-id=\"cube\"><sup>3</sup></span>"));
	$("#cbrt").click(() => setValue("<span data-id=\"cbrt\"><sup>3</sup>√</span>"));
	$("#polar-func").click(() => setValue("<span data-id=\"polar-func\">Pol</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#rec-func").click(() => setValue("<span data-id=\"rec-func\">Rec</span>**<span data-id=\"l-parenthesis\">(</span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#colon").click(() => setValue("<span data-id=\"colon\">:</span>"));
	$("#e-base-value").click(() => setValue("<span class=\"e-script\" data-id=\"e-script\">e</span>"));
	$("#reciprocal").click(() => setValue("<span data-id=\"reciprocal\"><sup>-1</sup></span>"));
	$("#factorial").click(() => setValue("<span data-id=\"factorial\">!</span>"));
	$("#combination-func").click(() => setValue("<span data-id=\"combination-func\"><b>C</b></span>", "<span data-id=\"r-parenthesis\">)</span>"));
	$("#permutation-func").click(() => setValue("<span data-id=\"permutation-func\"><b>P</b></span>", "<span data-id=\"r-parenthesis\">)</span>"));
});