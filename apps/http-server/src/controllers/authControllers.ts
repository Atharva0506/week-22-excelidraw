import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import {SignInScheam, SignUpScheam} from "@repo/common/types"
import bcryptjs from "bcryptjs"
import { createJwtToken } from "../utils/createToken";

export const signUp = async (req: Request, res: Response) => {
  const {email,username,password} = req.body
  const parsedData =  SignUpScheam.safeParse(req.body)

  if(!parsedData.success){
    console.log(parsedData.error);
    res.json({
        message: "Incorrect inputs"
    })
    return;
  }

  try {
    const isUserExist = await prismaClient.user.findUnique({
      where:{email:req.body.email}
    })

    if(isUserExist){
      res.json({
        "error":"Email Already in Use "
      }).status(411)
      return
    }

    const hashedPassword = await bcryptjs.hash(password,10)

   const newUser =await  prismaClient.user.create({
    data:{
    email:email,
    name:username,
    password:hashedPassword
   }
  })
  const token = await createJwtToken(newUser.id,email)

  res.json({
    "message":"User Created Successfully!!",
    "token":token
  }).status(200)

  } catch (error) {
    console.error("Error While Signup:", error)
    res.json({
      "error":"Internal Server Error"
    }).status(500)
  }
};

export const signIn = async (req: Request, res: Response) => {
  const {email , password} =  req.body

  const parsedData =  SignInScheam.safeParse(req.body)
  if(!parsedData.success){
    console.log(parsedData.error);
    res.json({
        message: "Incorrect inputs"
    })
    return;
  }
  try {
    
  
  const user = await prismaClient.user.findFirst({
    where:{email:req.body.email}
  })
  if(!user){
    res.json({
      "error":"User Dose Not Exist Sign Up!!! "
    }).status(403)
    return
  }
  const isMatch = await bcryptjs.compare(password,user.password)
  if(!isMatch){
    res.json({
      "error":"Invaild Password "
    }).status(400)
    return
  }
  const token = createJwtToken(user.id,email)

  res.json({
    "message":"Sign IN Successfully!!",
    "token":token
  }).status(200)

  } catch (error) {
    console.error("Error While Signup:", error)
    res.json({
      "error":"Internal Server Error"
    }).status(500)
  }
};
