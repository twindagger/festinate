'use strict';

// http://pekim.github.io/tedious/api-datatypes.html

import { TYPES as t } from 'tedious';

let convertedTypes = {
  bit: t.Bit,
  tinyInt: t.TinyInt,
  smallInt: t.SmallInt,
  int: t.Int,
  bigInt: t.BigInt,
  numeric: t.Numeric,
  decimal: t.Decimal,
  smallMoney: t.SmallMoney,
  money: t.Money,

  float: t.Float,
  real: t.Real,

  smallDatetime: t.SmallDateTime,
  datetime: t.DateTime,
  datetime2: t.DateTime2,
  datetimeOffset: t.DateTimeOffset,
  time: t.Time,
  date: t.Date,

  char: t.Char,
  varchar: t.VarChar,
  text: t.Text,

  nchar: t.NChar,
  nvarchar: t.NVarChar,
  ntext: t.NText,

  binary: t.Binary,
  varbinary: t.VarBinary,
  image: t.Image,

  null: t.Null,
  tvp: t.TVP,
  udt: t.UDT,
  uniqueIdentifier: t.UniqueIdentifier,
  xml: t.Xml
};

export default (typeName) => {
  let type = convertedTypes[typeName];
  if(!type){
    throw new Error(`Type ${typeName} does not exist as a sql type`);
  }
  return type;
};
