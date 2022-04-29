//引入express模块
const express=require('express')
//引入用户路由器
const userRouter=require('./routes/user.js')
//创建WEB服务器
const app=express()
//设置端口
app.listen(3000,()=>{
	console.log('WEB服务器启动成功')
})
//中间件...
//将post传递参数转为对象
app.use( express.urlencoded({
	extended:true //内部转对象是否使用第三方模块
}) )
//挂载路由器，路由器下的路由成为WEB服务器下的路由
//添加前缀/v1/users
app.use('/v1/users',userRouter)

//添加错误处理中间件，拦截所有的错误
app.use( (err,req,res,next)=>{
	//err 接收到的路由传递过来的错误
	console.log(err)
	//响应给前端
	res.send({code:500,msg:'服务器端错误'})
} )