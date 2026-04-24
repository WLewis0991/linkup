import { JwtPayload } from "jsonwebtoken"

interface User {
  id:number, 
  username:string,  
  email:string, 
  password:string,
  avatar:string, 
}

export interface CustomJwtPayload extends JwtPayload {
  userId: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export type { User , JwtPayload }