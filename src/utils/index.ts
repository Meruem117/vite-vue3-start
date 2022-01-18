import { IMAGE_URL_PREFIX } from '@/constant'

export function roundFun(value: number, n: number): number {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

export function convertNumber(play: number): string | number {
    return play > 10000 ? roundFun(play /= 10000, 1) + '万' : play
}

export function convertTime(tm: number): string {
    const d: Date = new Date(tm * 1000 + 2626560000)
    const y: number = new Date().getFullYear()
    const year: number = d.getFullYear()
    const month: number = d.getMonth()
    const date: number = d.getDate()
    return d.getFullYear() === y ? month + '-' + date : year + '-' + month + '-' + date
}

export function convertPlay(play: number): string {
    let res = 0
    if (play / 10000 > 0) {
        play /= 10000
        res = roundFun(play, 1)
    }
    return res + '万'
}

export function convertImageUrl(url: string): string {
    return IMAGE_URL_PREFIX + url
}