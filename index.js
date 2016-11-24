/* 存放下落食物对象 */
var FoodItems = [];
/* 记分：身价 */
var Score = 0;

/* vary the dog food */
var DogFoodKind = {
    0: {
        url: "img/food0.png",
        speed: 2,
        price: 10,
    },
    1: {
        url: "img/food1.png",
        speed: 3,
        price: 20,
    },
    2: {
        url: "img/food2.png",
        speed: 4,
        price: 30,
    },
    3: {
        url: "img/food3.png",
        speed: 5,
        price: 40,
    },
    4: {
        url: "img/food4.png",
        speed: 6,
        price: 50,
    },
    5: {
        url: "img/food5.png",
        speed: 7,
        price: 60,
    },
    6: {
        url: "img/food6.png",
        speed: 8,
        price: 70,
    },
    7: {
        url: "img/food7.png",
        speed: 9,
        price: 70,
    },
};

$(document).ready(function(e) {
    respond();
});
$(window).resize(function() {
    respond();
});
/* fit different device */
function respond() {
    var windowW = $(window).width();
    var windowH = $(window).height();
    $("#wrapper").css({ "width": windowW + "px", "height": windowH + "px" });

    return [
        windowW,
        windowH
    ];
}

/* dog or dogs */
var singleDog = {
    left: 0,
    height: 0,
    moving: function() {
        var displacementX = 0;
        var x1 = 0;
        var x2 = 0;

        /* start时会影响setInterval的速度 */
        $("#wrapper_back").bind({
            touchstart: function(evs) {
                x1 = evs.touches[0].clientX;
                // console.log("x1=>" + x1);
            },
            touchmove: function(evm) {
                x2 = evm.touches[0].clientX;
            },
            touchend: function(eve) {
                displacementX = x2 - x1;
                // console.log("displacementX=>" + displacementX);

                var getLeft = $("#doge").offset().left + displacementX;
                // console.log("getLeft=>" + getLeft);

                if (displacementX < 0) {
                    $("#doge").css("background-image", "url('img/left.gif')");
                } else if (displacementX > 0) {
                    $("#doge").css("background-image", "url('img/right.gif')");
                }

                if (getLeft < 0) {
                    getLeft = 0;
                } else if (getLeft > $(window).width() * 0.79) {
                    getLeft = $(window).width() * 0.79;
                }
                // $("#doge").css("left", getLeft + "px");
                $("#doge").stop().animate({
                    "left": getLeft + "px",
                }, Math.abs(displacementX) * 5);
            }
        });

        return [
            x1,
            x2
        ];
    },
    jump: function() {
        $("#wrapper_back").click(function() {
            if (parseInt($("#doge").css("bottom")) <= 0.06 * $(window).height()) {
                $("#doge").addClass("jump");
                setTimeout(function() {
                    $("#doge").removeClass("jump");
                }, 290);
            }
        });

        return true;
    },
};

/* game order */
var GameStage = {
    rainfood: 0,
    crashed: 0,
    cartoon: 0,
    /* initialize the game */
    init: function() {
        GameStage.start();
    },

    /* show the rule and starting button */
    start: function() {
        $("#layer_btn_run").click(function() {
            GameStage.prepare();
        });
    },

    /* ready to play */
    prepare: function() {
        $("#layer").css({ "display": "none" });
        /* 开始游戏 */
        GameStage.play();
    },

    /* now, play the game */
    play: function() {
        /* create food */
        // rainFood();
        //      var rainfood = setInterval(rainFood, 2000);
        GameStage.rainfood = setRainFood();
        singleDog.moving();
        singleDog.jump();
        GameStage.cartoon = setCartoon();
        GameStage.crashed = setCrashedCheck();

    },

    /* trigger the ends */
    end: function() {
        clearInterval(GameStage.cartoon);
        clearInterval(GameStage.rainfood);
        clearInterval(GameStage.crashed);
        FoodItems = null;
        $("#layer").css("display", "block");

        $("#share").show();
        $("#price_box").show();
        $("#rule_img").hide();
        $("#layer").hide();
        // $("#wrapper").hide();
        $("#score").hide();
        $("#restart").show();

        var e = 0;
        var end_words = "结束语";
        var end_dog_url = "img/rule.png";
        var end_background = "img/begay.gif";
        var end_kind = "茶杯犬";
        var dog_url = "img/1800.jpg";
        // $("body").css({"background-image":"url('img/bg.png')"});
        if (e == 0) {
            // 变基佬
            $("#price_box").css({ "background": "url(" + end_background + ")" });
        } else {
            // 遇到情侣
            $("#price_box").css({ "background": "url(" + end_background + ")" });
        }

        if (Score > 0 && Score < 1800) {
            end_words = "恭喜你获得了" + Score + "分";
            end_dog_url = "img/rule.png";
        } else if (Score > 1800 && Score < 2400) {
            end_words = "恭喜你获得了" + Score + "分";
            end_dog_url = "img/rule.png";
            end_kind = "德牧犬";
            dog_url = "img/2400.jpg";
        } else {
            end_words = "恭喜你获得了" + Score + "分";
            end_dog_url = "img/rule.png";
            end_kind = "柯基";
            dog_url = "img/4500.jpg";
        }
        $("#words").text(end_words);
        $("#dog_pic").attr("src", end_dog_url);
        $("#end_kind").text(end_kind);
        $("#end_kind").next().attr("src","img/kind.png");
        $("#end_kind").next().next().attr("src",dog_url);
        GameStage.restart();
    },

    restart: function() {
        $("#restart").click(function() {
            window.location.reload();
        });
    }
}
GameStage.init();

/* rain the dog foods */
function setRainFood() {

    t = setInterval(function() {
        rainFood();
    }, 2000);

    function rainFood() {
        /* create food once in js */
        var food = createItem();
        // console.log(food);

        /* produce food once in HTML */
        $("#wrapper_back").append("<img class='rain-food' id='" + food.id + "' src='" + food.url + "' />");

        /* initialize the food falling */
        food.fall;

        /* initialize */
        $("#" + food.id).css("left", food.x + "px");

        /* fall and remove when out of screen */
        var t = setInterval(function() {
            $("#" + food.id).css("top", food.y + "px");
            if (food.y > $(window).height()) {
                food.isCrash = 1;
                clearInterval(t);
                food.stop();
                $("#" + food.id).remove();
                food = null;
            }
        }, 18);

    }


    function createItem() {

        var foodKind = parseInt(Math.random() * 6);
        var foodItem = {
            id: "food" + FoodItems.length,
            isCrash: 0,
            x: Math.random() * $(window).width() * 0.85,
            y: 0,
            speed: DogFoodKind[foodKind].speed,
            url: DogFoodKind[foodKind].url,
            price: DogFoodKind[foodKind].price,

            // setInterval!!!
            fall: setInterval(function() {
                foodItem.y += foodItem.speed;
                //console.log(food.id);
            }, 18),
            stop: function() {
                clearInterval(foodItem.fall);
            }
        };

        /* global */
        // Array.push!!!
        FoodItems.push(foodItem);
        return foodItem;
    }

    /* 定时器 */
    return t;
}


/* 边缘检测 */
function setCrashedCheck() {

    t = setInterval(function() {
        isCrashed();
    }, 18);

    function isCrashed() {
        FoodItems.forEach(function(item) {
            var upOffset = item.y;
            var downOffset = item.y + $("#" + item.id).height();
            var leftOffset = item.x;
            var rightOffset = item.x + $("#" + item.id).height();
            var dogTop = $("#doge").offset().top;
            var dogBottom = $("#doge").offset().top + $("#doge").height();
            var dogLeft = $("#doge").offset().left;
            var dogRight = $("#doge").offset().left + $("#doge").width();

            var picString = $("#doge").css("background-image");
            var reg = /\w*?(?=.gif)/g;
            var lOrR = reg.exec(picString)

            if (lOrR == "left" && downOffset > dogTop && rightOffset > dogLeft && upOffset < dogBottom && leftOffset < dogRight) {
                cutFood(item);

                return 1;
            } else if (lOrR == "right" && downOffset > dogTop && leftOffset < dogRight && upOffset < dogBottom && rightOffset > dogLeft) {
                cutFood(item);

                return 1;
            }
        });

        return 0;
    }


    function cutFood(that) {
        that.isCrash = 1;
        $("#" + that.id).remove();

        Score += that.price;
        $("#score_show").text(Score);

        return that.price;
    }

    return t;
}

/* cross dash dog */
// 跑过来的情侣动画
function setCartoon() {

    var dashDog = {
        0: {
            url: "img/gay0.gif",
            speed: 1,
        },
        1: {
            url: "img/gay1.gif",
            speed: 1.2,
        },
        2: {
            url: "img/gay2.gif",
            speed: 1.6,
        },
        3: {
            url: "img/gay3.gif",
            speed: 2,
        },
        4: {
            url: "img/gay4.gif",
            speed: 2.2,
        },
        5: {
            url: "img/gay5.gif",
            speed: 2.4,
        },
        6: {
            url: "img/gay6.gif",
            speed: 2.5,
        },
        7: {
            url: "img/gay10.gif",
            speed: 3,
        },
        8: {
            url: "img/couple0.gif",
            speed: 1,
        },
        9: {
            url: "img/couple1.gif",
            speed: 1,
        }
    };

    var num = 0;
    var ct = setInterval(function() {
        createDash(num);
    }, 6000);

    var check = setInterval(function() {
        switch (checkHurt()) {
            case 1:
                {
                    clearInterval(check);
                    GameStage.end();
                    break;
                }
            case 0:
            default:
                break;
        }
    }, 18);

    function createDash(num) {
        var n = Math.floor(Math.random() * 10);
        /* direction为0表示从左往右，1表示从右往左 */
        var direction = Math.floor(Math.random() * 2);

        // 创建gay
        $("#dog").append('<img src=' + dashDog[n].url + ' class="running-dog running-dog' + num + '">');
        $(".running-dog" + num).css("left", direction * 200 - 50 + "%");
        if (!direction) {
            $(".running-dog" + num).css("transform", "rotateY(180deg)");
        }
        $(".running-dog" + num).animate({ "left": (1 - direction) * 200 - 50 + "%" }, 5000 * dashDog[n].speed, function() {
            $(this).remove();
        });

        num++;

        return [
            n,
            direction,
        ];
    }

    function checkHurt() {
        var hurtLevel = 0;
        $(".running-dog").each(function() {
            var doge_position = $("#doge").offset();
            var running_dog_pisition = $(this).offset();

            var doge_left = doge_position.left;
            var doge_right = doge_position.left + $("#doge").width();
            var doge_top = doge_position.top;
            var doge_bottom = doge_position.top + $("#doge").height();
            //			console.log("doge_left=>" + doge_left + "doge_right=>" + doge_right + "doge_top=>" + doge_top + "doge_bottom=>" + doge_bottom);

            var running_dog_left = running_dog_pisition.left;
            var running_dog_right = running_dog_pisition.left + $(this).width();
            var running_dog_top = running_dog_pisition.top;
            var running_dog_bottom = running_dog_pisition.top + $(this).height();
            //			console.log("running_dog_left=>" + running_dog_left + "running_dog_right=>" + running_dog_right + "running_dog_top=>" + running_dog_top + "running_dog_bottom=>" + running_dog_bottom);

            var distance_left = Math.abs(doge_left - running_dog_left);
            var distance_right = Math.abs(doge_right - running_dog_right);
            var distance_top = Math.abs(doge_top - running_dog_top);
            var distance_bottom = Math.abs(doge_bottom - running_dog_bottom);
            //			console.log("distance_top=>" + distance_top + "distance_right=>" + distance_right + "distance_bottom=>" + distance_bottom + "distance_left=>" + distance_left);

            if (distance_left < 20 || distance_right < 20) {
                if (distance_top < 20 || distance_bottom < 20) {
                    console.log("crash!");

                    hurtLevel = 1;
                }
            }
        });

        return hurtLevel;
    }

    return ct;
}

$(document).ready(function() {
    $("#dog_tag").animate({ top: "10%" }, 1800);
});