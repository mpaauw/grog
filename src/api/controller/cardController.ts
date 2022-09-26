import {
  Controller, Get, Path, Route,
} from 'tsoa';
import { container } from 'tsyringe';
import { CardDocument } from '../../database/model/cardDocument';
import { CardService } from '../service/cardService';

@Route('/v1/card')
export class CardController extends Controller {
  private cardService!: CardService;

  public constructor() {
    super();
    this.cardService = container.resolve(CardService);
  }

  @Get('{cardName}')
  public async getCard(@Path() cardName: string): Promise<CardDocument<any>> {
    return this.cardService.getCard(cardName);
  }
}
