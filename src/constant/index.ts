// up
export const UP_LIST_SIZE = 10
export const UP_BACKGROUND_IMAGE = 'http://i0.hdslb.com/bfs/space/cb1c3ef50e22b6096fde67febe863494caefebad.png@2560w_400h_100q_1o.webp'
// user
export const USER_LIST_SIZE = 10
export const ROLES = {
    admin: 'admin',
    user: 'user'
}
export const GENDER = {
    male: '男',
    female: '女',
    default: '保密'
}
export const DEFAULT_LOCATION = '保密'
export const DEFAULT_BIRTHDAY = '保密'
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'
export const CITY_LIST = [
    {
        value: '浙江',
        label: '浙江',
        children: [
            {
                value: '杭州',
                label: '杭州'
            },
        ]
    },
    {
        value: '江苏',
        label: '江苏',
        children: [
            {
                value: '南京',
                label: '南京'
            },
        ]
    }
]
// video
export const VIDEO_LIST_SIZE = 30
export const IMAGE_URL_PREFIX = 'https://images.weserv.nl/?url='
// log
export const GENERATE_LOG_NUMBER = 100
// mapreduce
export const BASE_HDFS_INPUT_PATH = '/project/input/'
export const BASE_HDFS_OUTPUT_PATH = '/project/output/'
export const BASE_LOCAL_LOG_PATH = '/opt/data/project/log'
export const TYPE = {
    UP: 1,
    VIDEO: 2,
    LOCATION: 3
}
export const CITY_MAP: { [key: string]: string } = {
    '江苏省': '江苏',
    '浙江省': '浙江',
    '上海市': '上海',
    '广东省': '广东',
    '北京市': '北京'
}
// hive
export const HIVE_DOC_PATH = '/src/assets/docs/Hive.md'
