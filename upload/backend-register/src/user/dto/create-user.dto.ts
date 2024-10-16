import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password:string;
}

export class CreateLoginDto{
    @ApiProperty()
    email:string;
    @ApiProperty()
    password:string;
}

export class CreateForgotPassDto{
    @ApiProperty()
    email:string;
}
