/* eslint-disable no-restricted-syntax */

import { createWorker, PSM } from 'tesseract.js';
import { LoggerUtil } from './loggerUtil';

export class ImageHelper {
  private static logger = LoggerUtil.createLogger(
    process.env.ENVIRONMENT === 'local' ? __filename : ''
  );

  public static async getCardNameTextFromImage(
    imageSource: string
  ): Promise<string> {
    try {
      // TODO: Worker should probably be initialized within ctor / init scope, not method.
      const worker = createWorker();

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      });
      const imageRecognitionResult = await worker.recognize(imageSource);
      await worker.terminate();

      let builtName = '';
      let lowConfidenceCount = 0;
      for (const word of imageRecognitionResult.data.words) {
        if (word.confidence >= 85) {
          builtName += `${word.text} `;
        } else {
          lowConfidenceCount += 1;
        }

        if (lowConfidenceCount >= 3) {
          break;
        }
      }

      return builtName.trim();
    } catch (error) {
      this.logger.error('Failed to get card name text from image URL.', {
        imageSource,
        error,
      });
      throw error;
    }
  }
}
