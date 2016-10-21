var containers = [
    {name:"meter", items: 10, width:300, height: 300, path:"./GIF/Meter/thermometer", ext:".png", rule:function(i){return i}},
    {name:"stackable", items: 5, width:175, height: 325, path:"./GIF/Stackable/volcano", ext:".gif", rule:function(i){return i}},
    {name:"crossfade", items: 5, width:300, height: 300, path:"./GIF/Crossfade/mountain", ext:".png", rule:function(i){return i}}];

var boxen = containers.map(function(container, index) {
    var frames = new Array(container.items);
    for (var i = 0; i < frames.length; i++) frames[i] = container.path + container.rule(i+1) + container.ext;
    frames = frames.map(function (url) {
        var frame = new Frame(url,container.width, container.height);
        if(container.frames)frame.setFrameAmount(container.frames);
        return frame;
    });
    var box = new Animator(frames,index*325,0);
    console.log("X:",box.getX(), box.getY());
    return box.setName(container.name)
       .setCurrentStep(0)
       .setTransitionDuration(500)
       .display();


});


function ulClicked(item){
    console.log(item);
}

$("li").on("click", function(){
   var step = parseInt($(this).text())-1;
    var boxes =
    boxen.map(function(box){
        //console.log((step <= box.getCurrentStep()) ? "Going Down" : "Going Up");
        var frame = (step <= box.getCurrentStep()) ? Animator.prototype.fadeOut : Animator.prototype.fadeIn;
        if(box.getName().replace(/#/g,"") == "crossfade"){
            box.transitionToStep(Animator.prototype.crossFade, step);
        }else{
            box.transitionToStep(frame, step);
        }
        //box.setCurrentStep(step);
    });
});
