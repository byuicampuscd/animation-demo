"use strict";

function Frame(location,width, height) {
    this.file = location;
    this.opacity = 0;
    this.width = width;
    this.height = height;
    this.frameAmount = 1;
}


Frame.prototype.getFrameAmount = function () {
    return this.frameAmount;
}
Frame.prototype.getWidth = function () {
    return this.width;
}
Frame.prototype.getHeight = function () {
    return this.height;
}



Frame.prototype.setWidth = function (width) {
    this.width = width;
    return this;
}
Frame.prototype.setHeight = function (height) {
    this.height = height;
    return this;
}
Frame.prototype.getOpacity = function () {
    return this.opacity;
}
Frame.prototype.setOpacity = function (opactiy) {
    this.opacity = opactiy;
    return this;
}
Frame.prototype.getFile = function () {
    return this.file;
}
Frame.prototype.setFile = function (location) {
    this.file = location;
    return this;
}
Frame.prototype.setFrameAmount = function (amount) {
        this.frameAmount = amount;
        return this;
    }
    /*
     * THE ANIMATOR CLASS
     */
function Animator(states,x,y) {
    this.x = x;
    this.y = y;
    this.states = states;
    this.currentStep = 0;
    this.Name = undefined;
    this.transitionDuration = 0;
    this.frames = [];
}

Animator.prototype.display = function () {
     var currentAnimator = this;
     var group = document.createElementNS("http://www.w3.org/2000/svg","g");
            group.setAttributeNS(null ,"id",this.getName());
            group.setAttributeNS(null ,"transform", "translate("+this.getX()+","+this.getY()+")");
            document.querySelector("#target").appendChild(group);
    var items = this.states.map(function (frame, index) {


            var svg = $(currentAnimator.getName());
            var image;
            if (currentAnimator.frames.length < index + 1) {
                image = document.createElementNS("http://www.w3.org/2000/svg","image");
                image.setAttributeNS("http://www.w3.org/1999/xlink","href",frame.getFile());
                image.setAttributeNS(null ,"x",0);
                image.setAttributeNS(null ,"y",0);
                image.setAttributeNS(null ,"height",frame.getHeight());
                image.setAttributeNS(null ,"width",frame.getWidth());
                image.setAttributeNS(null ,"visibility","visibile");

                group.appendChild(image);
                console.log(svg);
                currentAnimator.frames.push(image);
            }
            else {
                svg = currentAnimator.frames[index];
            }
            if (index <= currentAnimator.getCurrentStep()) {
                frame.setOpacity(100);
            }
            else {
                frame.setOpacity(0);
               $(image).attr("opacity", "0");
            }
            var fadeOut = window.setInterval(function(){
                window.clearInterval(fadeOut);
            },1500);
            return frame;

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
Animator.prototype.getName = function () {
    return this.Name;
}
Animator.prototype.getTransitionDuration = function () {
    return this.transitionDuration;
}
Animator.prototype.setStates = function () {
    this.states = states;
    return this;
}
Animator.prototype.setCurrentStep = function (step) {
    if (step < 0) step = 0;
    if (step >= this.states.length) step = this.states.length - 1;
    this.currentStep = step;
    return this;
}
Animator.prototype.setName = function (Name) {
    this.Name = Name;
    return this;
}
Animator.prototype.setTransitionDuration = function (durration) {
    this.transitionDuration = durration;
    return this;
}
Animator.prototype.setX= function(x){
    this.x = x;
    return this;
}
Animator.prototype.setY= function(y){
    this.y = y;
    return this;
}
Animator.prototype.getX= function(){
    return this.x;
}
Animator.prototype.getY= function(){
    return this.y;
}
Animator.prototype.transitionToStep = function (transition, step) {
    // dont move uf you are already there
    if (step == this.currentStep) return this;

    // puts step into range
    if (step < 0) step = 0;
    if (step >= this.states.length) step = this.states.length - 1;
    console.log("STEP:", step);

    // are wer going left or right
    var direction = (step < this.currentStep) ? -1 : 1;

    // how many frames per step?
    var currentFrameDurration = (this.states.length/5);
    console.log("Frame", currentFrameDurration);

    // how fast do we need to go?
    var difference = (this.transitionDuration / Math.abs(step - this.currentStep%5))/currentFrameDurration;
    console.log("Difference: "+difference);

    // establish a starting point
    var index = this.currentStep;
    var me = this;

    // create a path to the step
    var pathToStep = [];
    // FPS
    var inc = (step+1)*(currentFrameDurration)-1;
    var path = getNumberPath(this.currentStep, inc);

    // Loop Through Animations
    function complete() {
        // set current step to last step
        me.setCurrentStep(path[0]);
        // moves to next step in chain
        path.splice(0, 1);
        // stops the image from disappearing from the screen
        if (path.length <= 0 || (transition === Animator.prototype.fadeOut && path.length <= 1)) {
            if ((transition === Animator.prototype.fadeOut && path.length <= 1)) console.log("too far back");
                console.log("End of the Line Partner!");
            // break animation loop when finished
            return;
        }
        // calls next step in loop
        transition.call(me, path[0], difference, complete);
    }
    console.log(me.getCurrentStep(), path[0], "Inc:", inc)
    // starts the anmation chain
    transition.call(me, path[0], difference, complete);
}

function getNumberPath(num1, num2) {
    var largest = (num1 > num2) ? num1 : num2;
    var smallest = (num1 <= num2) ? num1 : num2;
    var items = [];
    for (var i = smallest; i <= largest; i++) items.push(i);
    if (num1 == largest) items.sort(function (a, b) {
        if (a > b) return -1;
        else if (a < b) return 1;
        return 0;
    });
    return items;
}
Animator.prototype.crossFade = function (step, durration, callback) {
    if (!callback) callback = function () {};
    //console.log(callback);
    console.log(step, this.currentStep);
    this.fadeIn(step, durration, callback);
    this.fadeOut(this.currentStep, durration, function () {});
}
Animator.prototype.fadeIn = function (step, durration, callback) {
    //console.log("Fade In", step);
    //console.log(durration);
    this.states[step].setOpacity(100);
    $(this.frames[step]).animate({
        opacity: this.states[step].getOpacity() / 100
    }, durration, callback);
}
Animator.prototype.fadeOut = function (step, durration, callback) {
        //  console.log("Fade Out", step);
        //   console.log(durration)
        this.states[step].setOpacity(0);
        $(this.frames[step]).animate({
            opacity: this.states[step].getOpacity() / 100
        }, durration, callback);
    }
    /*var frames = new Array(5);
    for (var i = 0; i < frames.length; i++) frames[i] = "./GIF/Crossfade/c" + (i + 1) + ".png";
    frames = frames.map(function (url) {
        return new Frame(url, 350, 650);
    });
    console.log(frames);
    var box1 = new Animator(frames);
    box1.setName("#crossfade")
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
