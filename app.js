const request = require('superagent')
const cron = require('cron')
const _ = require('lodash')
const fs = require('fs')
const mkdirp = require('mkdirp')
const moment = require('moment')
const logger = require('./logger')

const db = require('./db')

const yamlConfig = require('yaml-config')
const config = yamlConfig.readConfig(__dirname + '/config.yaml')

const entities = require('he')


global.Promise = require('bluebird')
const CronJob = cron.CronJob

const TimeZone = 'Asia/Shanghai'
const cosmetic_url = config.api_url + '/fwAction.do'
const startIndex = 1

// 运行程序时立即执行一次
start()

/**
 * 全量爬取方法
 */
async function start() {
    try {
        const result = await sendRequest(cosmetic_url, 'getBaNewInfoPage', { page: startIndex })
        // const pageCount = result.pageCount
        // console.log(result)

        const new_time = _.replace(result.list[0].provinceConfirm, /-/g, '') || 0 // 最新数据的时间
        const old_time = config.update_time // 前次爬取数据时的时间
        console.log(new_time)
        console.log(old_time)

        let i = 0
        let change_time = new_time

        while (change_time > old_time) {
            i++
            logger.info('爬取第' + i + '页++++++')
            const result = await sendRequest(cosmetic_url, 'getBaNewInfoPage', { page: i })
            change_time = _.replace(result.list[0].provinceConfirm, /-/g, '')

            if(change_time === old_time) {
                config.update_time = result.totalCount
                yamlConfig.updateConfig(config, __dirname + '/config.yaml', 'default')
                break
            }
            // logger.info(result)
            const records = buildData(result)
            // console.log(records)
            // 此处不能使用_.forEach
            for (let record of records) {
                // await saveData('cosmetic_list', record)
                if(_.replace(record.apply_date, /-/g, '') === old_time) {
                    config.update_time = result.totalCount
                    yamlConfig.updateConfig(config, __dirname + '/config.yaml', 'default')
                    break
                }
                const baInfo = await sendRequest(cosmetic_url, 'getBaInfo', { processid: record.processid })
                if (baInfo && !_.isEmpty(baInfo.id)) {
                    const newBaInfo = buildInfo(baInfo, record.apply_date)
                    await saveData('cosmetic_list', newBaInfo)
                    for (let pfList of baInfo.pfList) {
                        const pfresult = {
                            processid: record.processid,
                            cname: trimStr(ToCDB(pfList.cname))
                        }
                        // console.log(pfresult)
                        await insertPf('cosmetic_pflist', pfresult)
                    }
                } else {
                    logger.error(`detail page error, processid: ${record.processid} productName: ${record.productName}`)
                }
                /* const attachments = await sendRequest(cosmetic_url, 'getAttachmentCpbz', { processId: record.processid })
                 const ssid = attachments.ssid.substr(0, attachments.ssid.length-1)
                 for (let attachment of attachments.result) {
                   await saveAttachData('cosmetic_attachment', attachment)
                   downloadFile(attachment, ssid)
                 }*/
            }
        }

        /*for (let i = 1; i <= currentPage; i++) {
            logger.info('爬取第' + i + '页++++++总共' + currentPage + '页')
            const result = await sendRequest(cosmetic_url, 'getBaNewInfoPage', { page: i })
        }*/
        logger.info('<<<数据爬取完成>>>')
    } catch (err) {
        logger.info(err)
    }
}

/**
 * 组装列表信息
 *
 * @param {Object} data
 * @returns
 */
function buildData(data) {
    const records = data.list || {}
    let results = []
    _.forEach(records, record => {
        if (record.is_off == 'N') {
            const result = {
                processid: record.processid,
                apply_sn: record.applySn,
                enterpriseName: record.enterpriseName,
                // is_off: 'Y' == record.is_off ? 1 : 0,
                productName: _.trim(entities.decode(record.productName)),
                apply_date: record.provinceConfirm
            }
            results.push(result)
        }
    })
    return results
}
/**
 * 封装化妆品详情信息
 *
 * @param {Object} data
 * @returns
 */
function buildInfo(data, updated) {
    const record = data || {}
    const result = {
        processid: record.processid,
        apply_date: record.apply_date,
        productname: _.trim(entities.decode(record.productname)),
        remark: record.remark,
        parent_id: record.parent_id,
        org_name: record.org_name,
        org_code: record.org_code,
        launch_date: record.launch_date,
        is_entrust: record.is_entrust,
        is_auto_product: record.is_auto_product,
        sid: record.id,
        flow_name: record.flow_name,
        enterprise_sn: record.enterprise_sn,
        displayname: record.displayname,
        apply_sn: record.apply_sn,
        applytype: record.applytype,
        enterprise_name: record.scqyUnitinfo.enterprise_name,
        enterprise_address: record.scqyUnitinfo.enterprise_address,
        real_enterprise_name: record.sjscqyList[0].enterprise_name,
        real_enterprise_address: record.sjscqyList[0].enterprise_address,
        updated: updated
        // enterprise_healthpermits: record.sjscqyList[0].enterprise_healthpermits
    }
    return result
}

function sendRequest(url, method, options) {
    return request.post(url)
        .query({ method: method })
        .send(options)
        .set('Content-Type', 'application/x-www-form-urlencoded;utf-8')
        .set('Accept', 'application/json')
        .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3044.0 Safari/537.36"')
        .retry(5)
        .then((res) => {
            return res.body
        }).catch(err => {
            logger.error(err)
        })
}

/**
 * 查询并插入数据方法
 *
 * @param {String} table
 * @param {Object} data
 * @returns
 */
async function saveData(table, data) {
    const processid = data.processid
    try {
        let [rows] = await db.query(`SELECT * FROM ${table} WHERE processid = ? OR productName = ?`, [processid, data.productname])
        // console.log(rows)
        if (_.isEmpty(rows)) {
            const inserts = data || {}
            const record = await db.query(`INSERT INTO ${table} SET ?`, inserts)
            // logger.info(record)
            return record
        }
    } catch (err) {
        logger.error(err)
        logger.info(table, require('util').inspect(data))
    }
}

/**
 * 查询并插入化妆品成分表
 *
 * @param {String} table
 * @param {Object} data
 * @returns
 */
async function insertPf(table, data) {
    const { processid, cname } = data
    try {
        let [rows] = await db.query(`SELECT * FROM ${table} WHERE processid = ? AND cname = ?`, [processid, cname])

        if (_.isEmpty(rows)) {
            const inserts = data || {}
            const record = await db.query(`INSERT INTO ${table} SET ?`, inserts)
            // logger.info(record)
            return record
        }
    } catch (err) {
        logger.error(err)
    }
}

function filterAttachData(data) {
    const record = data || {}
    const result = {
        processid: record.processid,
        fid: record.id,
        fileName: record.fileName,
        fileType: record.fileType,
        fileSize: record.fileSize,
        postedTime: record.postedTime,
        savePath: record.savePath
    }
    return result
}

/**
 * 查询并插入附件数据
 *
 * @param {String} table
 * @param {Object} data
 * @returns
 */
async function saveAttachData(table, data) {
    const { processid, id } = data
    try {
        let rows = await db.query(`SELECT * FROM ${table} WHERE processid = ? AND fid = ?`, [processid, id])
        if (_.isEmpty(rows)) {
            const inserts = filterAttachData(data) || {}
            const record = await db.query(`INSERT INTO ${table} SET ?`, inserts)
            // logger.info(record)
            return record
        }
    } catch (err) {
        logger.error(err)
    }
}

/**
 * 下载图片附件
 *
 * @param {Object} attachment
 * @param {String} ssid
 * @returns
 */
function downloadFile(attachment, ssid) {
    const { savePath, id, fileName, fileType } = attachment
    const img_url = `http://125.35.6.80:8080/ftba/itownet/download.do?method=downloadFile&fid=${id}&ssid=${ssid}`
    const destination_file = savePath + fileName + fileType
    if (false == fs.existsSync(savePath)) {
        mkdirp.sync(savePath)
    }
    const res = request.get(img_url).retry(5).pipe(fs.createWriteStream(destination_file), { end: false })
    return res
}
/**
 * Seconds: 0-59
 * Minutes: 0-59
 * Hours: 0-23
 * Day of Month: 1-31
 * Months: 0-11
 * Day of Week: 0-6
 */
// 工作日(周一至周五)11点30分执行
const job = new CronJob('00 30 22 * * 1-7', function() {
        /*
         * Runs every weekday (Monday through Friday)
         * at 20:30:00 PM. It does not run on Saturday
         * or Sunday.
         */
    start()
}, function() {
        /* This function is executed when the job stops */
    logger.info('the job stop')
},
    true, /* Start the job right now */
    TimeZone /* Time zone of this job. */
)

logger.info('job status', job.running)

// 全角转换为半角

function ToCDB(str) {
    var tmp = ''
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) == 12288) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
            continue
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
        } else {
            tmp += String.fromCharCode(str.charCodeAt(i))
        }
    }
    return tmp
}

function trimStr(str) {
    // return _.trimEnd(_.trimStart(_.trim(str), '('), ')?*')
    let newStr = str
    if (/^\([^\(\)]+\)$/.test(str)) {
        console.log(str)
        newStr = _.trimEnd(_.trimStart(_.trim(str), '('), ')?*.、')
    } else {
        newStr = _.trimEnd(_.trimStart(_.trim(str), '\''), '?*.、')
    }
    let lastStr = _.replace(_.replace(_.replace(newStr, /\?/g, ' '), /\(\s/g, '('), /\s\)/g,')'
  )
    return lastStr
}
