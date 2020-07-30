const socket = io('/')
const vidGrid = document.getElementById('vid-grid')
const mypeer = new Peer(undefined,{
    host: '/',
    port:'3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    addVidStream(myVideo , stream)

    mypeer.on('call' , call =>{
        call.answer(stream)
        const video = document.createElement('video')
    call.on('stream',userVidStream=>{
        addVidStream(video,userVidStream)
      })
    })
    
    socket.on('user-connected' , userId =>{
        connectToNewUser(userId, stream)
    })
})
 
socket.on('user-disconected' , userId =>{
  if(peers[userId]) peers[userId].close()
})

mypeer.on('open' , id =>{
    socket.emit('join-room', ROOM_ID , id)

})

function connectToNewUser(userId, stream){
const call = mypeer.call(userId , stream)
const video = document.createElement('video')
call.on('stream' , userVidStream =>{
    addVidStream(video, userVidStream)
})
call.on('close' , () =>{
    video.remove()
})
peers[userId] = call
}

function addVidStream(video , stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () =>{
        video.play()
    })
    vidGrid.append(video)
}