import {
  Controller, Get, Path, Route,
} from 'tsoa';
import { container } from 'tsyringe';
import { GrogCard } from '../../common/model/grogCard';
import { CardService } from '../service/cardService';

@Route('/v1/card')
export class CardController extends Controller {
  private cardService!: CardService;

  public constructor() {
    super();
    this.cardService = container.resolve(CardService);
  }

  @Get('{cardName}')
  public async getCard(@Path() cardName: string): Promise<GrogCard<any>> {
    return this.cardService.getCard(cardName);
  }
}
