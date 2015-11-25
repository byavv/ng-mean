import UsersService     from "./users.service";
import AuthService      from "./auth.service";
import IdentityService      from "./identity.service";
import ServerMessageHandlerService      from "./serverMessage.service";


let sharedModule: ng.IModule = angular.module("services", [])
    .service(UsersService.serviceId, UsersService)
    .service(IdentityService.serviceId, IdentityService)
    .service(AuthService.serviceId, AuthService)
    .service(ServerMessageHandlerService.serviceId, ServerMessageHandlerService);
export default sharedModule;
