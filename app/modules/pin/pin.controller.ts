import { InternalServerError } from 'restify-errors';
import { IPin } from '../../../app/interfaces/models';
import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import { twilio, env } from '../../../config/env';
import * as Twilio from 'twilio';
import Pin from '../../models/pin.model';
import * as restify from 'restify';
import to from 'await-to-js';

export default class PeriodicalCronListener implements IController {
  public async post(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const pin = req.body;

      const search = <IPin> await Pin.findOne({ phone: pin.phone });

      if (!search) {
        const saved = await Pin.create({ code: pin.code, phone: pin.phone });
        return res.send(saved);
      } else {
        return res.send(new restify.BadRequestError('Phone number already exists'));
      }
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError());
    }
  }

  public async get(req: IRequest, res: IResponse, next: restify.Next) {
    try {
      const pin = <IPin> await Pin.findOne({ phone: req.params.phone });

      if (!pin) {
        return res.send(new restify.NotFoundError('Pin not found for given phone'));
      }

      if (env !== 'production') {
        return res.send(pin);
      } else {
        const accountSid = twilio.sid;
        const authToken = twilio.token;
        const fromPhoneNumber = twilio.number;
        const client = Twilio(accountSid, authToken);
        const [err, success] = await to (client.messages.create({
          body: 'Please use this code: ${pin.code}',
          to: pin.phone,
          from: fromPhoneNumber
        }));

        if (err) {
          return res.send(new restify.InternalServerError('Could not send message'));
        } else {
          return res.send({ success: true, message: 'Pin has been sent to your phone' });
        }
      }
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError());
    }
  }
}
