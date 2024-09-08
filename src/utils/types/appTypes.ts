export interface appInfotypes{    
    name:string;
    logo:string;
    description:string;
};

export interface userInfotypes {
    id:string;
    name:string;
    picture?:String;
    email:string;
    email_verified:boolean;
    password?:string;
    authOrigin:string;
    secret?:string;
    totpStatus:boolean;  
};

export interface signupTypes {    
    message:string | null;
    loading:boolean;
    error:string | null;
}