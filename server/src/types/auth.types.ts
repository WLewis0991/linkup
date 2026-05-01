import { JwtPayload } from "jsonwebtoken"

interface User {
  id:string, 
  username:string,  
  email:string, 
  password:string,
  avatar:string, 
}

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
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