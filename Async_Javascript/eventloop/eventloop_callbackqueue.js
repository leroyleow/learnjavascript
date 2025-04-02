//https://www.youtube.com/watch?v=8aGhZQkoFbQ
//https://youtu.be/eiC58R16hb8
//Event loops are basically for callbacks and promises
[1, 2, 3, 4, 5].forEach(function (v) {
    console.log(v);
});

//async
function asyncForEach(array, cb){
    array.forEach(function () {
        setTimeout(cb, 0);
    };
}

asyncForEach([1, 2, 3, 4, 5], function (v) {
    console.log(v);
});


//https://claude.ai/chat/a41d8a7d-43ee-4b41-abd2-1e451a647ca5
//https://chat.deepseek.com/a/chat/s/894f5e8b-c433-42ca-8a9c-a261b18874f7