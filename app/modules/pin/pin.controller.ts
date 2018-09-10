import { InternalServerError } from 'restify-errors';
import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import Pin from '../../models/pin.model';
import * as restify from 'restify';

export default class PeriodicalCronListener implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const pin = req.body;

      const saved = await Pin.create({ code: pin.code, phone: pin.phone });

      return res.send(saved);
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError());
    }
  }

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const pin = await Pin.findOne({ phone: req.params.phone });

      if (!pin) {
        return res.send(new restify.NotFoundError('Pin not found for given phone'));
      }

      return res.send(pin);
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError());
    }
  }
}
