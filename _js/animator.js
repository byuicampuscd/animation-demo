"use strict";

function Animation(location, width, height) {
    this.file = location;
    this.opacity = 0;
    this.width = width;
    this.height = height;
}
Animation.prototype.getWidth = function () {
    return this.width;
}
Animation.prototype.getHeight = function () {
    return this.height;
}
Animation.prototype.setWidth = function (width) {
    this.width = width;
    return this;
}
Animation.prototype.setHeight = function (height) {
    this.height = height;
    return this;
}
Animation.prototype.getOpacity = function () {
    return this.opacity;
}
Animation.prototype.setOpacity = function (opactiy) {
    this.opacity = opactiy;
    return this;
}
Animation.prototype.getFile = function () {
    return this.file;
}
Animation.prototype.setFile = function (location) {
        this.file = location;
        return this;
    }
    /*
     * THE ANIMATOR CLASS
     */
function Animator(states) {
    this.states = states;
    this.currentStep = 0;
    this.scene = undefined;
    this.transitionDuration = 0;
    this.frames = [];
}
Animator.prototype.display = function () {
        var currentAnimator = this;
        var items = this.states.map(function (animation, index) {
            var svg;
            if (currentAnimator.frames.length < index + 1) {
                 svg = $("<svg width=\"" + animation.getWidth() + "\" height=\"" + animation.getHeight() + "\" viewBox=\"0 0 " + animation.getWidth() + " " + animation.getHeight() + "\" preserveAspectRatio=\"xMidYMid meet\">");
                $(svg).html('<image xlink:href="' + animation.getFile() + '" x="0" y="0" height="' + animation.getHeight() + '" width="' + animation.getWidth() + '"/>');
                currentAnimator.frames.push(svg);
            }else{
                svg = currentAnimator.frames[index];
            }

            if (index <= currentAnimator.getCurrentStep()) {
                animation.setOpacity(100);
            }else{
                animation.setOpacity(0);
                $(svg).css("opacity",animation.getOpacity());
            }
            $(svg).animate({
                opacity: animation.opacity / 100
            }, 1500);
            $(currentAnimator.scene).append(svg);
            return animation;
        });
        return this;
    }
    // Getters and Setters
Animator.prototype.getStates = function () {
    return this.states.map(function (x) {
        return x;
    });
}
Animator.prototype.getCurrentStep = function () {
    return this.currentStep;
}
Animator.prototype.getScene = function () {
    return this.scene;
}
Animator.prototype.getTransitionDuration = function () {
    return this.transitionDuration;
}
Animator.prototype.setStates = function () {
    this.states = states;
    return this;
}
Animator.prototype.setCurrentStep = function (step) {
    if(step < 0) step = 0;
    if(step >= this.states.length) step = this.states.length-1;
    this.currentStep = step;
    return this;
}
Animator.prototype.setScene = function (scene) {
    this.scene = scene;
    return this;
}
Animator.prototype.setTransitionDuration = function (durration) {
    this.transitionDuration = durration;
    return this;
}

Animator.prototype.transitionToStep = function (transition, step) {
    if(step == this.currentStep) return this;
    if(step < 0) step = 0;
    if(step >= this.states.length) step = this.states.length-1;
    console.log("STEP:", step);
    var direction = (step < this.currentStep) ? -1 : 1;

    var difference = this.transitionDuration/Math.abs(step - this.currentStep);

    var index = this.currentStep;
    var me = this;
    //for(var  i= 0; i < 5; i ++)


    var pathToStep = [];
    var path = getNumberPath(this.currentStep, step);

    function complete(){
        me.setCurrentStep(path[0]);
        path.splice(0,1);
        if(path.length <= 0 || (transition === Animator.prototype.fadeOut && path.length <= 1)){
            if((transition === Animator.prototype.fadeOut && path.length <= 1))
                console.log("too far back");
            console.log("End of the Line Partner!");
            return;
        }
        transition.call(me, path[0],difference,complete);
    }
    console.log(me.getCurrentStep(),path[0])
    transition.call(me, path[0],difference,complete);



}


function getNumberPath(num1, num2){
    var largest = (num1 > num2) ? num1 : num2;
    var smallest = (num1 <= num2) ? num1: num2;
    var items = [];
    for(var i = smallest; i <= largest; i++)
        items.push(i);
    if(num1 == largest)
        items.sort(function(a,b){
            if(a > b)
                return -1;
            else if(a < b)
                return 1;
            return 0;
        });
    return items;
}

Animator.prototype.crossFade = function(step, durration, callback){
    if(!callback)callback = function(){};
    //console.log(callback);
    console.log(step,this.currentStep);
    this.fadeIn(step, durration, callback);
    this.fadeOut(this.currentStep, durration, function(){});

}
Animator.prototype.fadeIn = function(step, durration, callback){
    //console.log("Fade In", step);
    //console.log(durration);
    this.states[step].setOpacity(100);
    $(this.frames[step]).animate({
        opacity:this.states[step].getOpacity()/100
    }, durration, callback);
}
Animator.prototype.fadeOut = function(step, durration, callback){
     //  console.log("Fade Out", step);
    //   console.log(durration)
     this.states[step].setOpacity(0);
    $(this.frames[step]).animate({
        opacity:this.states[step].getOpacity()/100
    }, durration, callback);
}

/*var animations = new Array(5);
for (var i = 0; i < animations.length; i++) animations[i] = "./GIF/Crossfade/c" + (i + 1) + ".png";
animations = animations.map(function (url) {
    return new Animation(url, 350, 650);
});
console.log(animations);
var box1 = new Animator(animations);
box1.setScene("#crossfade")
    .setCurrentStep(0)
    .setTransitionDuration(1500)
    .display();
var transition = Animator.prototype.fadeIn;
box1.transitionToStep(transition, 4);
/*
 * DEGUBBING
 */
/*
var item = 0;
var going_back = false;
window.setInterval(function () {
        if (item < box1.getStates().length && !going_back){
            box1.setCurrentStep(item).display();
            item++;
        }else if(going_back && item <= 0){
            going_back = false;
        }else{
            going_back = true;
            box1.setCurrentStep(item).display();
            item--;
        }
    }, 1500)
    //*/
