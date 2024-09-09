const mongoFilterQuery = {
  name: 'John',
  qty: 19,
  createdAt: new Date(),
  isActive: true,
  updatedAt: {
    $gte: new Date(),
    $lte: new Date()
  },
  no: {
    $in: [1, 2, 3]
  },
  no2: {
    $in: ['1', '2', '3']
  },
  status: {
    $nin: ['active', 'inactive']
  },
  $and: [
    {
      name2: 'John2',
      name3: 'John3'
    },
    {
      name4: 'John4',
      name5: 'John5'
    },
    {
      $or: [
        {
          name6: 'John6',
          name7: 'John7'
        },
        {
          name8: 'John8',
          name9: 'John9'
        }
      ]
    }
  ]
}

const sql = 'SELECT * FROM users'

const transformValueSql = (value) => {
  if (value instanceof Date) return `'${value.toISOString()}'`
  if (value === null || value === undefined) return `IS NULL`
  if (value === '') return `''`

  switch (typeof value) {
    case 'string':
      return `'${value}'`
    case 'number':
      return `${value}`
    case 'boolean':
      return `${Number(value) || 0}`
    default:
      return value
  }
}

const mongoFilterConditionToSql = (field, value) => {
  const keys = Object.keys(value)

  return keys.map(key => {
    const val = value[key]
    const operator = key.replace('$', '')
    const finalVal = transformValueSql(val)
    if (finalVal.includes('IS NULL')) return `${field} IS NULL`

    switch (operator) {
      case 'eq':
        return `${field} = '${finalVal}'`
      case 'gt':
        return `${field} > ${finalVal}`
      case 'lt':
        return `${field} < ${finalVal}`
      case 'gte':
        return `${field} >= ${finalVal}`
      case 'lte':
        return `${field} <= ${finalVal}`
      case 'ne':
        return `${field} != ${finalVal}`
      case 'in':
        return `${field} IN (${finalVal.map(v => transformValueSql(v)).join(', ')})`
      case 'nin':
        return `${field} NOT IN (${finalVal.map(v => transformValueSql(v)).join(', ')})`
      case 'exists':
        return `${field} IS ${finalVal ? 'NOT NULL' : 'NULL'}`
      case 'regex':
        return `${field} REGEXP '${finalVal}'`
      default:
        return ''
    }
  })
}

const mongoFilterQueryToSql = (q) => {
  const fields = Object.keys(q)

  return fields.map(field => {
    const value = q[field]

    if (Array.isArray(value) && ['$and', '$or'].includes(field)) {
      if (field === '$or') {
        return `(${value.map(v => `(${mongoFilterQueryToSql(v)})`).join(' OR ')})`
      }

      return `(${value.map(v => `(${mongoFilterQueryToSql(v)})`).join(' AND ')})`
    }

    if (value instanceof Date) return `${field} = '${value.toISOString()}'`
    if (value === null || value === undefined) return `${field} IS NULL`
    if (value === '') return `${field} = ''`

    const v = transformValueSql(value)

    if (typeof value === 'object') return mongoFilterConditionToSql(field, value).join(' AND ')
    if (v.includes('IS NULL')) return `${field} IS NULL`

    return `${field} = ${v}`
  }).join(' AND ')
}

const sqlFilterQuery = mongoFilterQueryToSql(mongoFilterQuery)
const queryWhere = sqlFilterQuery ? ` WHERE ${sqlFilterQuery}` : ''

const sqlQuery = `${sql} ${queryWhere}`
console.log(sqlQuery)
