import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateForgotPassDto, CreateLoginDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response,Request } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body()createUserDto: CreateUserDto,@Res() res: Response) {
    try{
      const {name, email, password} = createUserDto;
      console.log(name, email);
      const info = await this.userService.register(name, email, password);
      return res.status(HttpStatus.OK).json({
        message:name+", "+info
      })
    }
    catch(err){
      console.error(err)
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Mail not sent'});
    }
   
  }

  @Post(`verify`)
  async verifyToken(@Body() token, @Res() res:Response, @Req() req:Request) {
    // console.log("From controller: ", token.tok);
    try{
      const state = await this.userService.verifySignUpToken(token.tok);
      // console.log(state);
      res.status(HttpStatus.OK).json({
        message:'Verified Successfully',
        success: true,
        data: state.name
      });
    }
    catch(err){
      // console.log("Form backend ---------")
      console.error(err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        success: false
      })
    }
  }

  @Post('signin')
  async signinUser(@Body() data:CreateLoginDto, @Res() res:Response, @Req() req:Request){
    console.log("From signin point")
    try{
      // console.log(data)
      const signin = await this.userService.loginUser(data);
      res.status(HttpStatus.OK).json({
        message:'Login Information',
        success: true,
        data: signin
      });
    }
    catch(err){
      console.error(err)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        success: false
      })
    }
  }
  
  @Post('forgotpass')
  async forgotPass(@Body() data:CreateForgotPassDto, @Res() res:Response, @Req() req:Request){
    console.log("From forgotpass point")
    try{
      // console.log(data)
      const info = await this.userService.forgotPass(data);
      res.status(HttpStatus.OK).json({
        message:'Login Information',
        success: true,
        data: info
      });
    }
    catch(err){
      console.error(err)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        success: false
      })
    }
  }

  @Post('verifyresettoken')
  async verifyResetPassToken(@Body() data, @Res() res:Response, @Req() req:Request){
    try{
      const info = await this.userService.verifyResetPassToken(data);
      res.status(HttpStatus.OK).json({
        message:'Password Reseted Successfully',
        success: true,
        data: info
      });
    }
    catch(err){
      console.error(err)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        success: false
      })
    }
  }  
}
