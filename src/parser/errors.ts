import { SourceLocation, codeFrameColumns } from '@babel/code-frame';
import lineColumn from 'line-column';
import * as ohm from 'ohm-js';

type ErrorResult = {
  result: string;
};

type ErrorSource = {
  result: undefined;
  message: string;
  source: string;
  locStart: number;
  locEnd: number;
};

class LoggableError extends Error {
  constructor(info: ErrorResult | ErrorSource) {
    let result = '';

    if (typeof info.result === 'undefined') {
      const { message, source, locStart, locEnd } = info;

      const lc = lineColumn(source);
      const start = lc.fromIndex(locStart);
      const end = lc.fromIndex(Math.min(locEnd, source.length - 1));

      const location: SourceLocation = {
        start: {
          line: start?.line ?? source.length - 1,
          column: start?.col,
        },
        end: {
          line: end?.line ?? source.length,
          column: end?.col,
        },
      };

      result = codeFrameColumns(source, location, {
        message: message,
      });
    } else {
      result = info.result;
    }

    super(result);

    this.name = 'BaseError';
  }
}

export class CSTParsingError extends LoggableError {
  constructor(matchResult: ohm.MatchResult) {
    super({ result: matchResult.message ?? '' });

    this.name = 'CSTParsingError';
  }
}

export class UnknownConcreteNodeTypeError extends LoggableError {
  constructor(message: string, source: string, locStart: number, locEnd: number) {
    super({ result: undefined, message, source, locStart, locEnd });

    this.name = 'UnknownConcreteNodeTypeError';
  }
}

export class ASTParsingError extends LoggableError {
  constructor(message: string, source: string, locStart: number, locEnd: number) {
    super({ result: undefined, message, source, locStart, locEnd });

    this.name = 'ASTParsingError';
  }
}
