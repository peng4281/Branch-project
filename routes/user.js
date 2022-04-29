//引入express模块
const express=require('express')
//引入连接池模块
const pool=require('../pool.js')
//创建路由器对象
const r=express.Router()
//1.用户注册接口(post /reg)
//接口地址：http://127.0.0.1:3000/v1/users/reg
//请求方式：post
r.post('/reg',(req,res,next)=>{
	//1.1获取post传递的参数
	var obj=req.body
	console.log(obj)
	//1.2验证传递的参数
	//验证手机号码格式
	if( !/^1[3-9]\d{9}$/.test(obj.phone) ){
		res.send({code:401,msg:'手机号码格式错误'})
		//阻止往后执行
		return
	}
	//const pool=require('../pool.js')
	//1.3执行SQL命令，插入数据
	pool.query('insert into xz_user set ?',[obj],(err,r)=>{
		if(err){
			//如果SQL中有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		console.log(r)
		res.send({code:200,msg:'注册成功'})
	})
	
})
//暴露路由器对象
r.get('/list',(req,res,next)=>{
	var start=(req.query.pno-1)*req.query.count
	var size=parseInt(req.query.count)
	if(req.query.pno===undefined)req.query.pno=1
	if(req.query.count===undefined)req.query.count=5
	pool.query('select uid,uname from xz_user limit ?,?',[start,size],(err,r)=>{
		if(err){
			next()
			return
		}
		res.send({code:200,msg:'查询成功',data:r})
	})
})
r.post('/login',(req,res,next)=>{
	obj=req.body
	console.log(obj)
	if(!obj.uname){
		res.send({code:401,msg:'用户名不能为空'})
		return
	}
	if(!obj.upwd){
		res.send({code:402,msg:'密码不能为空'})
		return
	}
	pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,r)=>{
		if(err){
			next(err)
			return
		}
		console.log(r)
		// res.send({code:200,msg:'登陆成功'})
		if(r.length===0){
			res.send({code:501,msg:'登陆失败'})
		}else{
			res.send({code:200,msg:'登陆成功'})
		}
		
	})
	
})
r.put('/',(req,res,next)=>{
	var obj=req.body
	pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,r)=>{
		if(err){
			next(err)
			return
		}
		if(r.affectedRows===0){
			res.send({code:501,msg:'修改失败'})
		}else{
			res.send({code:200,msg:'修改成功'})
		}
	})
})


r.delete('/cut/uid:', (req, res) => {
    var obj = req.params
    pool.query('delete from xz_user where ?', [obj], (err, result, next) => {
        if (err) next(err)
        if (result.affectedRows == 0) {
            res.send({ code: 401, msg: '删除失败' })
        } else {
            res.send({ code: 200, msg: '删除成功' })
        }
    })
})
module.exports=r