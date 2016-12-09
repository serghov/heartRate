var canvas,conxtext;
var unprocessedData=[];
var processedData=[];
var average=[0,0];

$(document).ready(function(){
    // Put event listeners into place

    // Grab elements, create settings, etc.
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
     var video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code); 
        };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }

    var videoHeight, videoWidth;
    var canvasCoef=1;
    
    
    function updateCavnasImage()
    {
        videoHeight= $(video).height();
        videoWidth=$(video).width();
        canvas.width=videoWidth*canvasCoef;
        canvas.height=videoHeight*canvasCoef;
        //var startTime=Date.now();
        context.drawImage(video, 0, 0, videoWidth*canvasCoef, videoHeight*canvasCoef);
        processImage();
        setTimeout(updateCavnasImage,33);
    }
    
    function processImage()
    {
       
        var mRect=[canvas.width/2-25, canvas.height/2-15, 50, 30];
  
        
        var average=0;
        for (var i=mRect[0];i<mRect[0]+mRect[2];i++)
        {
            for (var j=mRect[1];j<mRect[1]+mRect[3];j++)
            {
                average+=context.getImageData(i, j, 1, 1).data[1];
            }
        }
        average/=mRect[2]*mRect[3];
                
        context.beginPath();
        context.rect(mRect[0],mRect[1],mRect[2],mRect[3]);
        context.fillStyle = 'rgb('+parseInt(average)+','+parseInt(average)+','+parseInt(average)+')';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'blue';
        context.stroke();
        
        unprocessedData.push([average,Date.now()]);
        processedData = normalizeArray(unprocessedData,450);
        
        var intPoints=processedData;
        for (var g=0;g<processedData.length;g++)
            intPoints[g]=parseInt(intPoints[g]);
        
        $('#dataPoints').text(intPoints.join(', '));
        
        if (processedData.length>449)
        {
            $('#heartRate').text(findHeartRate(dft(processedData),processedData[processedData.length-1][1]-processedData[0][1]));
            console.log(processedData[processedData.length-1][1]-processedData[0][1]);
        }
        unprocessedData=processedData;
        
    }
   
    
    //setTimeout(function(){
       
        updateCavnasImage();
    //},2000);
});
function normalizeArray(data, length)
{
    var res = [];
    if (data.length<length)
        return data;
    for (var i=data.length-length;i<data.length;i++)
        res.push(data[i]);
    return res;        
}
function dft(data)
{
    var i,j;
    var res=[];
    for (i=0;i<data.length;i++)
    {
        res.push(0);
        for (j=0;j<data.length;j++)
        {
            res[i]+=data[j][0]*Math.cos(2*3.1415*i*j/data.length);
        }
    }
    return res;
}
function findHeartRate(data, duration)
{
    var fps=data.length*60*1000/duration;
    var heartRate=0;
    var maxData=0;
    for (var i=0;i<data.length;i++)
    {
        if (i*fps/data.length>50 && i*fps/data.length<150 && data[i]>maxData)
        {
            maxData=data[i];
            heartRate=i*fps/data.length;
        }
    }
    average[0]+=heartRate;
    average[1]++;
    //return heartRate;
    return parseInt(average[0]/average[1]);
}
