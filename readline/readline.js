const readline = require('readline')
const rl  = readline.createInterface({
    input : process.stdin,
    output : process.stdout
}) ; 


rl.on('line' , (input)=>{
    const [op , key , value] = input.split(' ')
    if(op === 'get') {
      console.log(key , value)
    }else if(op === 'set') {

    }else if(op === 'quit'){
        rl.close()
    }else {
        console.log('操作有误')
    }
    
  
})


rl.on('close' , ()=>{
    console.log('结束')
    process.exit(0)
})