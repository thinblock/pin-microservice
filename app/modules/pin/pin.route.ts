import PinController from './pin.controller';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class PinRoute implements IRoute {
  public basePath = '/pins';
  public controller = new PinController();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.OAUTH,
        handler: this.controller.post,
      },
      {
        method: HttpMethods.GET,
        param: 'phone',
        auth: AuthStrategies.OAUTH,
        handler: this.controller.get,
      }
    ];
  }
}

export default PinRoute;
