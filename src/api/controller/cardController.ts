import {
  Controller, Get, Path, Route,
} from 'tsoa';
import { container } from 'tsyringe';
import { GrogData } from '../../common/model/grogData';
import { CardService } from '../service/cardService';

@Route('/v1/card')
export class CardController extends Controller {
  private cardService!: CardService;

  public constructor() {
    super();
    this.cardService = container.resolve(CardService);
  }

  @Get('{cardName}')
  public async getCard(@Path() cardName: string): Promise<GrogData<any>> {
    return this.cardService.getCard(cardName);
  }

  // TODO: add API to refresh card db
}
