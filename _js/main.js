var boxen = [];

var containers = [
    {name:"meter", items: 5, width:300, height: 300, path:"./GIF/Meter/thermometer", ext:".png", rule:function(i){return i}},
    {name:"stackable", items: 5, width:175, height: 325, path:"./GIF/Stackable/volcano", ext:".gif", rule:function(i){return i}},
    {name:"crossfade", items: 5, width:300, height: 300, path:"./GIF/Crossfade/mountain", ext:".png", rule:function(i){return i}}];

containers.map(function(container) {
    var animations = new Array(container.items);
    for (var i = 0; i < animations.length; i++) animations[i] = container.path + container.rule(i+1) + container.ext;
    animations = animations.map(function (url) {
        return new Animation(url, container.width, container.height);
    });
    var box = new Animator(animations);
    box.setScene("#"+container.name)
       .setCurrentStep(0)
       .setTransitionDuration(1500)
       .display();
    boxen.push(box);
});


function ulClicked(item){
    console.log(item);
}

$("li").on("click", function(){
   var step = parseInt($(this).text())-1;
    var boxes =
    boxen.map(function(box){
        //console.log((step <= box.getCurrentStep()) ? "Going Down" : "Going Up");
        var animation = (step <= box.getCurrentStep()) ? Animator.prototype.fadeOut : Animator.prototype.fadeIn;
        if(box.getScene().replace(/#/g,"") == "crossfade"){
            box.transitionToStep(Animator.prototype.crossFade, step);
        }else{
            box.transitionToStep(animation, step);
        }
        //box.setCurrentStep(step);
    });
});
