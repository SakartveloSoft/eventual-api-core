
export interface ICommandResponse {
    success:boolean;
    message?:string;
}

export interface ICommandBinding<TCommand extends object, TResponse extends ICommandResponse> {

}