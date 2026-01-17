import axios from 'axios';
import NodeCache from 'node-cache';
import crypto from 'crypto';

export interface ApiResponse {
    success: boolean;
    creator: string;
    data: any;
    metadata: any;
    message: string | null;
}

export interface TokenData {
    token: string;
    deviceId: string;
    androidId: string;
    spoffer: string;
    uuid: string;
    timestamp: number;
    expiry: number;
}

export interface DramaItem {
    bookId: string;
    bookName: string;
    cover: string;
    coverWap: string;
    introduction: string;
    chapterCount: number;
    playCount: number;
    tagV3s: string[];
    corner?: {
        name: string;
        color: string;
    };
}

export interface ChapterItem {
    chapterId: string;
    chapterIndex: number;
    chapterName: string;
    chapterIndexStr: string;
    duration: number;
    cover: string;
    cdnList?: Array<{
        cdnId: string;
        isDefault: number;
        videoPathList: Array<{
            videoPath: string;
            quality: number;
            isDefault: number;
        }>;
    }>;
    videoPath?: string;
}

export interface DramaDetail {
    bookId: string;
    bookName: string;
    coverWap: string;
    introduction: string;
    tagV3s: string[];
    chapterCount: number;
    playCount: number;
    isEnd: number;
    payChapterNum: number;
    totalEpisodes: number;
    corner?: {
        name: string;
        color: string;
    };
}

export interface SearchResult {
    isMore: boolean;
    book: Array<{
        id: string;
        name: string;
        cover: string;
        introduction: string;
        tags: string[];
        playCount: number;
    }>;
}

export interface CategoryItem {
    typeTwoId: number;
    typeTwoName: string;
    cover: string;
    count: number;
}

export interface TheaterResponse {
    page: number;
    total: number;
    results: DramaItem[];
}

export interface ChaptersResponse {
    bookId: string;
    totalChapters: number;
    chapters: ChapterItem[];
}

export interface BatchDownloadResponse {
    bookId: string;
    totalEpisodes: number;
    episodes: Array<{
        chapterId: string;
        chapterIndex: number;
        chapterName: string;
        videoPath: string;
    }>;
}

export interface StreamResponse {
    status: string;
    apiBy: string;
    data: {
        bookId: string;
        allEps: number;
        chapter: {
            id: string;
            index: number;
            indexCode: string;
            duration: number;
            cover: string;
            video: {
                mp4: string;
                m3u8: string;
            };
        };
    };
}

export interface ScraperConfig {
    language?: string;
    version?: string;
    timeout?: number;
    maxRetries?: number;
    cacheTTL?: number;
    userAgent?: string;
    requestDelay?: number;
}

export class DramaboxScraper {
    private baseUrl: string = 'https://sapi.dramaboxdb.com';
    private webficUrl: string = 'https://www.webfic.com';
    private tokenCache: TokenData | null = null;
    private language: string;
    private timeout: number;
    private maxRetries: number;
    private cache: NodeCache;
    private userAgent: string;
    private version: string;
    private requestDelay: number;
    private lastRequestTime: number = 0;

    constructor(config: ScraperConfig = {}) {
        this.language = config.language || 'in';
        this.timeout = config.timeout || 30000;
        this.maxRetries = config.maxRetries || 3;
        this.userAgent = config.userAgent || 'okhttp/4.10.0';
        this.version = config.version || '470';
        this.requestDelay = config.requestDelay || 1000;

        this.cache = new NodeCache({
            stdTTL: config.cacheTTL || 300,
            checkperiod: 60,
            useClones: false,
        });
    }

    private async applyRateLimit(): Promise<void> {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;
        if (elapsed < this.requestDelay) {
            await this.delay(this.requestDelay - elapsed);
        }
        this.lastRequestTime = Date.now();
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateRandomIP(): string {
        return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private randomAndroidId(): string {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    private decodeString(encoded: string): string {
        let result = '';
        for (let i = 0; i < encoded.length; i++) {
            let c = encoded.charCodeAt(i);
            if (c >= 33 && c <= 126) {
                c -= 20;
                if (c < 33) c += 126 - 33;
            }
            result += String.fromCharCode(c);
        }
        return result;
    }

    private getPrivateKey(): crypto.KeyObject {
        try {
            const part1 = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9Q4Y5QX5j08HrnbY3irfKdkEllAU2OORnAjlXDyCzcm2Z6ZRrGvtTZUAMelfU5PWS6XGEm3d4kJEKbXi4Crl8o2E/E3YJPk1lQD1d0JTdrvZleETN1ViHZFSQwS3L94Woh0E3TPebaEYq88eExvKu1tDdjSoFjBbgMezySnas5Nc2xF28";
            
            const encodedStr = `l|d,WL$EI,?xyw+*)^#?U\`[whXlG\`-GZif,.jCxbKkaY"{w*y]_jax^/1iVDdyg(Wbz+z/$xVjCiH0lZf/d|%gZglW)"~J,^~}w"}m(E'eEunz)eyEy\`XGaVF|_(Kw)|awUG"'{{e#%$0E.ffHVU++$giHzdvC0ZLXG|U{aVUUYW{{YVU^x),J'If\`nG|C[\`ZF),xLv(-H'}ZIEyCfke0dZ%aU[V)"V0}mhKvZ]Gw%-^a|m'\`\\f}{(~kzi&zjG+|fXX0$IH#j\`+hfnME"|fa/{.j.xf,"LZ.K^bZy%c.W^/v{x#(J},Ua,ew#.##K(ki)$LX{a-1\\MG/zL&JlEKEw'Hg|D&{EfuKYM[nGKx1V#lFu^V_LjVzw+n%+,Xd`;
            const part2 = this.decodeString(encodedStr);
            
            const part3 = "x52e71nafqfbjXxZuEtpu92oJd6A9mWbd0BZTk72ZHUmDcKcqjfcEH19SWOphMJFYkxU5FRoIEr3/zisyTO4Mt33ZmwELOrY9PdlyAAyed7ZoH+hlTr7c025QROvb2LmqgRiUT56tMECgYEA+jH5m6iMRK6XjiBhSUnlr3DzRybwlQrtIj5sZprWe2my5uYHG3jbViYIO7GtQvMTnDrBCxNhuM6dPrL0cRnbsp/iBMXe3pyjT/aWveBkn4R+UpBsnbtDn28r1MZpCDtr5UNc0TPj4KFJvjnV/e8oGoyYEroECqcw1LqNOGDiLhkCgYEAwaemNePYrXW+MVX/hatfLQ96tpxwf7yuHdENZ2q5AFw73GJWYvC8VY+TcoKPAmeoCUMltI3TrS6K5Q/GoLd5K2BsoJrSxQNQFd3ehWAtdOuPDvQ5rn/2fsvgvc3rOvJh7uNnwEZCI/45WQg+UFWref4PPc+ArNtp9Xj2y7LndwkCgYARojIQeXmhYZjG6JtSugWZLuHGkwUDzChYcIPd";
            const part4 = "W25ndluokG/RzNvQn4+W/XfTryQjr7RpXm1VxCIrCBvYWNU2KrSYV4XUtL+B5ERNj6In6AOrOAifuVITy5cQQQeoD+AT4YKKMBkQfO2gnZzqb8+ox130e+3K/mufoqJPZeyrCQKBgC2fobjwhQvYwYY+DIUharri+rYrBRYTDbJYnh/PNOaw1CmHwXJt5PEDcml3+NlIMn58I1X2U/hpDrAIl3MlxpZBkVYFI8LmlOeR7ereTddN59ZOE4jY/OnCfqA480Jf+FKfoMHby5lPO5OOLaAfjtae1FhrmpUe3EfIx9wVuhKBAoGBAPFzHKQZbGhkqmyPW2ctTEIWLdUHyO37fm8dj1WjN4wjRAI4ohNiKQJRh3QE11E1PzBTl9lZVWT8QtEsSjnrA/tpGr378fcUT7WGBgTmBRaAnv1P1n/Tp0TSvh5XpIhhMuxcitIgrhYMIG3GbP9JNAarxO/qPW6Gi0xWaF7il7Or";

            const fullPem = part1 + part2 + part3 + part4;
            const formattedKey = `-----BEGIN PRIVATE KEY-----\n${fullPem}\n-----END PRIVATE KEY-----`;

            return crypto.createPrivateKey({
                key: formattedKey,
                format: 'pem',
            });
        } catch (error) {
            throw new Error(`Failed to create private key: ${error}`);
        }
    }

    private sign(str: string): string {
        try {
            const privateKey = this.getPrivateKey();
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(str);
            const signature = sign.sign(privateKey);
            return signature.toString('base64');
        } catch (error) {
            throw new Error(`Sign error: ${error}`);
        }
    }

    private getTimeZoneOffset(): string {
        const offsetMin = new Date().getTimezoneOffset();
        const sign = offsetMin > 0 ? '-' : '+';
        const abs = Math.abs(offsetMin);
        const hh = String(Math.floor(abs / 60)).padStart(2, '0');
        const mm = String(abs % 60).padStart(2, '0');
        return `${sign}${hh}${mm}`;
    }

    private buildResponse(success: boolean, data: any = null, message: string | null = null, metadata: any = {}): ApiResponse {
        return {
            success,
            creator: 'zhadevv',
            data,
            metadata,
            message
        };
    }

    private handleError(error: any, context: string): ApiResponse {
        let message = `Failed to ${context}`;
        if (error.response) {
            message = `HTTP ${error.response.status}: ${context}`;
        } else if (error.message) {
            message = `${context}: ${error.message}`;
        }
        return this.buildResponse(false, null, message);
    }

    private isTokenValid(): boolean {
        if (!this.tokenCache) return false;
        return this.tokenCache.expiry > Date.now() + 5 * 60 * 1000;
    }

    async generateToken(): Promise<TokenData> {
        const cacheKey = `token_${this.language}`;
        const cachedToken = this.cache.get<TokenData>(cacheKey);
        if (cachedToken && cachedToken.expiry > Date.now()) {
            this.tokenCache = cachedToken;
            return cachedToken;
        }

        const timestamp = Date.now();
        const spoffer = this.generateRandomIP();
        const deviceId = this.generateUUID();
        const androidId = this.randomAndroidId();

        const headers: any = {
            tn: '',
            version: this.version,
            vn: '4.7.0',
            cid: 'DAUAF1064291',
            'package-Name': 'com.storymatrix.drama',
            Apn: '1',
            'device-id': deviceId,
            language: this.language,
            'current-Language': this.language,
            p: '48',
            'Time-Zone': this.getTimeZoneOffset(),
            md: 'Redmi Note 8',
            ov: '9',
            'over-flow': 'new-fly',
            'android-id': androidId,
            'X-Forwarded-For': spoffer,
            'X-Real-IP': spoffer,
            mf: 'XIAOMI',
            brand: 'Xiaomi',
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': this.userAgent,
        };

        const body = JSON.stringify({ distinctId: null });
        const signData = `timestamp=${timestamp}${body}${deviceId}${androidId}`;
        headers.sn = this.sign(signData);

        const url = `${this.baseUrl}/drama-box/ap001/bootstrap?timestamp=${timestamp}`;

        try {
            await this.applyRateLimit();
            const response = await axios.post(url, { distinctId: null }, { 
                headers, 
                timeout: this.timeout 
            });

            const responseData = response.data as any;

            if (!responseData?.data?.user) {
                throw new Error('Invalid token response - no user data');
            }

            const creationTime = Date.now();
            const tokenData: TokenData = {
                token: responseData.data.user.token,
                deviceId,
                androidId,
                spoffer,
                uuid: responseData.data.user.uid.toString(),
                timestamp: creationTime,
                expiry: creationTime + 24 * 60 * 60 * 1000,
            };

            this.tokenCache = tokenData;
            this.cache.set(cacheKey, tokenData, 3600);
            return tokenData;
        } catch (error: any) {
            throw new Error(`Token generation failed: ${error.message}`);
        }
    }

    async getToken(): Promise<TokenData> {
        if (this.isTokenValid()) {
            return this.tokenCache!;
        }
        return this.generateToken();
    }

    private buildHeaders(tokenData: TokenData, timestamp: number, payload: any = {}) {
        const body = JSON.stringify(payload);
        const headers: any = {
            tn: `Bearer ${tokenData.token}`,
            version: '451',
            vn: '4.5.1',
            cid: 'DAUAF1064291',
            'package-Name': 'com.storymatrix.drama',
            Apn: '1',
            'device-id': tokenData.deviceId,
            language: this.language,
            'current-Language': this.language,
            p: '46',
            'Time-Zone': this.getTimeZoneOffset(),
            md: 'Redmi Note 8',
            ov: '14',
            'over-flow': 'new-fly',
            'android-id': tokenData.androidId,
            mf: 'XIAOMI',
            brand: 'Xiaomi',
            'X-Forwarded-For': tokenData.spoffer,
            'X-Real-IP': tokenData.spoffer,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': this.userAgent,
        };

        const signData = `timestamp=${timestamp}${body}${tokenData.deviceId}${tokenData.androidId}${headers.tn}`;
        headers.sn = this.sign(signData);

        return headers;
    }

    async request(endpoint: string, payload: any = {}, isWebfic: boolean = false, method: string = 'POST', attempt: number = 0): Promise<any> {
        try {
            await this.applyRateLimit();
            const timestamp = Date.now();
            let url: string;
            let headers: any;

            if (isWebfic) {
                url = `${this.webficUrl}${endpoint}`;
                headers = {
                    'Content-Type': 'application/json',
                    pline: 'DRAMABOX',
                    language: this.language,
                };
            } else {
                const tokenData = await this.getToken();
                url = `${this.baseUrl}${endpoint}?timestamp=${timestamp}`;
                headers = this.buildHeaders(tokenData, timestamp, payload);
            }

            const config: any = {
                method: method.toUpperCase(),
                url,
                headers,
                timeout: this.timeout,
            };

            if (method.toUpperCase() !== 'GET') {
                config.data = payload;
            }

            const response = await axios.request(config);
            const responseData = response.data as any;

            if (!isWebfic && responseData && responseData.success === false) {
                if (attempt === 0) {
                    this.tokenCache = null;
                    this.cache.del(`token_${this.language}`);
                    await this.generateToken();
                    return await this.request(endpoint, payload, isWebfic, method, 1);
                }
                throw new Error(responseData.message || 'API request failed');
            }

            return responseData;
        } catch (error: any) {
            if (attempt < this.maxRetries) {
                await this.delay(1000 * (attempt + 1));
                return this.request(endpoint, payload, isWebfic, method, attempt + 1);
            }

            throw new Error(`Max retries reached for ${endpoint}: ${error.message}`);
        }
    }

    async getLatest(pageNo: number = 1): Promise<ApiResponse> {
        try {
            const cacheKey = `latest_${pageNo}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/he001/theater', {
                newChannelStyle: 1,
                isNeedRank: 1,
                pageNo,
                index: 1,
                channelId: 48,
            });

            const columnVoList = data?.data?.columnVoList || [];
            const results: DramaItem[] = [];

            columnVoList.forEach((column: any) => {
                if (column.bookList && Array.isArray(column.bookList)) {
                    column.bookList.forEach((book: any) => {
                        results.push({
                            bookId: book.bookId,
                            bookName: book.bookName,
                            cover: book.cover,
                            coverWap: book.coverWap,
                            introduction: book.introduction,
                            chapterCount: book.chapterCount,
                            playCount: book.playCount,
                            tagV3s: book.tagV3s || [],
                            corner: book.corner,
                        });
                    });
                }
            });

            const responseData: TheaterResponse = {
                page: pageNo,
                total: results.length,
                results
            };

            this.cache.set(cacheKey, responseData, 300);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch latest dramas');
        }
    }

    async getVip(): Promise<ApiResponse> {
        try {
            const cacheKey = `vip_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/he001/theater', {
                homePageStyle: 0,
                isNeedRank: 1,
                index: 4,
                type: 0,
                channelId: 205,
            });

            const columnVoList = data?.data?.columnVoList || [];
            const results: DramaItem[] = [];

            columnVoList.forEach((column: any) => {
                if (column.bookList && Array.isArray(column.bookList)) {
                    column.bookList.forEach((book: any) => {
                        results.push({
                            bookId: book.bookId,
                            bookName: book.bookName,
                            cover: book.cover,
                            coverWap: book.coverWap,
                            introduction: book.introduction,
                            chapterCount: book.chapterCount,
                            playCount: book.playCount,
                            tagV3s: book.tagV3s || [],
                            corner: book.corner,
                        });
                    });
                }
            });

            const responseData = {
                total: results.length,
                results
            };

            this.cache.set(cacheKey, responseData, 300);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch VIP dramas');
        }
    }

    async getDramaDetail(bookId: string): Promise<ApiResponse> {
        try {
            if (!bookId) {
                return this.buildResponse(false, null, 'Book ID is required');
            }

            const cacheKey = `detail_${bookId}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/chapterv2/detail', {
                needRecommend: true,
                from: 'book_album',
                bookId,
            });

            const bookData = data?.data?.book;
            if (!bookData) {
                return this.buildResponse(false, null, 'Drama not found');
            }

            const detail: DramaDetail = {
                bookId: bookData.bookId,
                bookName: bookData.bookName,
                coverWap: bookData.coverWap,
                introduction: bookData.introduction,
                tagV3s: bookData.tagV3s || [],
                chapterCount: bookData.chapterCount,
                playCount: bookData.playCount,
                isEnd: bookData.isEnd,
                payChapterNum: bookData.payChapterNum,
                totalEpisodes: bookData.totalEpisodes,
                corner: bookData.corner,
            };

            const recommendList = data?.data?.recommendList?.records || [];
            const recommendations: DramaItem[] = recommendList.map((item: any) => ({
                bookId: item.bookId,
                bookName: item.bookName,
                cover: item.cover,
                coverWap: item.coverWap,
                introduction: item.introduction,
                chapterCount: item.chapterCount,
                playCount: item.playCount,
                tagV3s: item.tagV3s || [],
                corner: item.corner,
            }));

            const responseData = {
                detail,
                recommendations
            };

            this.cache.set(cacheKey, responseData, 600);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch drama detail');
        }
    }

    async getChapters(bookId: string): Promise<ApiResponse> {
        try {
            if (!bookId) {
                return this.buildResponse(false, null, 'Book ID is required');
            }

            const cacheKey = `chapters_${bookId}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/chapterv2/batch/load', {
                boundaryIndex: 0,
                comingPlaySectionId: -1,
                index: 1,
                currencyPlaySource: 'discover_new_rec_new',
                needEndRecommend: 0,
                currencyPlaySourceName: '',
                preLoad: false,
                rid: '',
                pullCid: '',
                loadDirection: 0,
                bookId,
            });

            const chapterList = data?.data?.chapterList || [];
            const chapters: ChapterItem[] = chapterList.map((chapter: any) => {
                const cdn = chapter.cdnList?.find((c: any) => c.isDefault === 1);
                const videoPathList = cdn?.videoPathList || [];
                const videoPathItem = videoPathList.find((v: any) => v.isDefault === 1) || videoPathList[0];

                return {
                    chapterId: chapter.chapterId,
                    chapterIndex: chapter.chapterIndex,
                    chapterName: chapter.chapterName,
                    chapterIndexStr: chapter.chapterIndexStr,
                    duration: chapter.duration,
                    cover: chapter.cover,
                    cdnList: chapter.cdnList,
                    videoPath: videoPathItem?.videoPath,
                };
            });

            const responseData: ChaptersResponse = {
                bookId,
                totalChapters: data?.data?.chapterCount || 0,
                chapters,
            };

            this.cache.set(cacheKey, responseData, 600);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch chapters');
        }
    }

    async getStreamUrl(bookId: string, episode: number): Promise<ApiResponse> {
        try {
            if (!bookId || !episode) {
                return this.buildResponse(false, null, 'Book ID and episode are required');
            }

            const cacheKey = `stream_${bookId}_${episode}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const url = 'https://regexd.com/base.php';
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: `${url}?bookId=${bookId}`,
            };

            const response = await axios.get(url, {
                params: {
                    ajax: 1,
                    bookId: bookId,
                    lang: this.language,
                    episode: episode,
                },
                headers,
                timeout: this.timeout,
            });

            const rawData = response.data as any;

            if (!rawData || !rawData.chapter) {
                return this.buildResponse(false, null, 'Episode not found or locked');
            }

            const result: StreamResponse = {
                status: 'success',
                apiBy: 'regexd.com',
                data: {
                    bookId: bookId.toString(),
                    allEps: rawData.totalEpisodes,
                    chapter: {
                        id: rawData.chapter.id,
                        index: rawData.chapter.index,
                        indexCode: rawData.chapter.indexStr,
                        duration: rawData.chapter.duration,
                        cover: rawData.chapter.cover,
                        video: {
                            mp4: rawData.chapter.mp4,
                            m3u8: rawData.chapter.m3u8Url,
                        },
                    },
                },
            };

            this.cache.set(cacheKey, result, 600);
            return this.buildResponse(true, result);
        } catch (error) {
            return this.handleError(error, 'fetch stream URL');
        }
    }

    async getDramaList(pageNo: number = 1, pageSize: number = 10): Promise<ApiResponse> {
        try {
            const cacheKey = `list_${pageNo}_${pageSize}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/he001/classify', {
                typeList: pageNo == 1 ? [] : [
                    { type: 1, value: '' },
                    { type: 2, value: '' },
                    { type: 3, value: '' },
                    { type: 4, value: '' },
                    { type: 4, value: '' },
                    { type: 5, value: '1' },
                ],
                showLabels: false,
                pageNo: pageNo.toString(),
                pageSize: pageSize.toString(),
            }, false, 'POST');

            const rawList = data?.data?.classifyBookList?.records || [];
            const isMore = data?.data?.classifyBookList?.isMore || 0;

            const list = rawList.flatMap((item: any) => {
                if (item.cardType === 3 && item.tagCardVo?.tagBooks) {
                    return item.tagCardVo.tagBooks;
                }
                return [item];
            });

            const uniqueList = list.filter(
                (v: any, i: number, arr: any[]) => arr.findIndex((b: any) => b.bookId === v.bookId) === i
            );

            const books = uniqueList.map((book: any) => ({
                id: book.bookId,
                name: book.bookName,
                cover: book.coverWap,
                chapterCount: book.chapterCount,
                introduction: book.introduction,
                tags: book.tagV3s,
                playCount: book.playCount,
                cornerName: book.corner?.name || null,
                cornerColor: book.corner?.color || null,
            }));

            const result: SearchResult = {
                isMore: isMore == 1,
                book: books,
            };

            this.cache.set(cacheKey, result, 300);
            return this.buildResponse(true, result);
        } catch (error) {
            return this.handleError(error, 'fetch drama list');
        }
    }

    async getCategories(pageNo: number = 1, pageSize: number = 30): Promise<ApiResponse> {
        try {
            const cacheKey = `categories_${pageNo}_${pageSize}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/webfic/home/browse', { typeTwoId: 0, pageNo, pageSize }, true);

            const categories: CategoryItem[] = (data?.data?.types || []).map((item: any) => ({
                typeTwoId: item.typeTwoId,
                typeTwoName: item.typeTwoName,
                cover: item.cover,
                count: item.count,
            }));

            this.cache.set(cacheKey, categories, 1800);
            return this.buildResponse(true, categories);
        } catch (error) {
            return this.handleError(error, 'fetch categories');
        }
    }

    async getBooksByCategory(typeTwoId: number = 0, pageNo: number = 1, pageSize: number = 10): Promise<ApiResponse> {
        try {
            const cacheKey = `category_${typeTwoId}_${pageNo}_${pageSize}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/webfic/home/browse', { typeTwoId, pageNo, pageSize }, true);

            const bookList = data?.data?.bookList || [];
            const books: DramaItem[] = bookList.map((book: any) => ({
                bookId: book.bookId,
                bookName: book.bookName,
                cover: book.cover,
                coverWap: book.coverWap,
                introduction: book.introduction,
                chapterCount: book.chapterCount,
                playCount: book.playCount,
                tagV3s: book.tagV3s || [],
                corner: book.corner,
            }));

            this.cache.set(cacheKey, books, 300);
            return this.buildResponse(true, books);
        } catch (error) {
            return this.handleError(error, 'fetch books by category');
        }
    }

    async getRecommendedBooks(): Promise<ApiResponse> {
        try {
            const cacheKey = `recommend_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/he001/recommendBook', {
                isNeedRank: 1,
                newChannelStyle: 1,
                specialColumnId: 0,
                pageNo: 1,
                channelId: 43,
            });

            const rawList = data?.data?.recommendList?.records || [];
            const list = rawList.flatMap((item: any) => {
                if (item.cardType === 3 && item.tagCardVo?.tagBooks) {
                    return item.tagCardVo.tagBooks;
                }
                return [item];
            });

            const uniqueList = list.filter(
                (v: any, i: number, arr: any[]) => arr.findIndex((b: any) => b.bookId === v.bookId) === i
            );

            const books: DramaItem[] = uniqueList.map((book: any) => ({
                bookId: book.bookId,
                bookName: book.bookName,
                cover: book.cover,
                coverWap: book.coverWap,
                introduction: book.introduction,
                chapterCount: book.chapterCount,
                playCount: book.playCount,
                tagV3s: book.tagV3s || [],
                corner: book.corner,
            }));

            this.cache.set(cacheKey, books, 300);
            return this.buildResponse(true, books);
        } catch (error) {
            return this.handleError(error, 'fetch recommended books');
        }
    }

    async searchDramaIndex(): Promise<ApiResponse> {
        try {
            const cacheKey = `searchIndex_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/search/index');
            const hotVideoList = data?.data?.hotVideoList || [];

            const results = hotVideoList.map((item: any) => ({
                bookId: item.bookId,
                bookName: item.bookName,
                cover: item.cover,
                introduction: item.introduction,
                playCount: item.playCount,
            }));

            this.cache.set(cacheKey, results, 180);
            return this.buildResponse(true, results);
        } catch (error) {
            return this.handleError(error, 'fetch search index');
        }
    }

    async searchDrama(keyword: string, pageNo: number = 1, pageSize: number = 20): Promise<ApiResponse> {
        try {
            if (!keyword || keyword.trim() === '') {
                return this.buildResponse(false, null, 'Keyword is required');
            }

            const cacheKey = `search_${keyword}_${pageNo}_${pageSize}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/search/search', {
                searchSource: '搜索按钮',
                pageNo,
                pageSize,
                from: 'search_sug',
                keyword,
            });

            const rawResult = data?.data?.searchList || [];
            const isMore = data?.data?.isMore;

            const books = rawResult.map((book: any) => ({
                id: book.bookId,
                name: book.bookName,
                cover: book.cover,
                introduction: book.introduction,
                tags: book.tagNames || [],
                playCount: book.playCount,
            }));

            const result: SearchResult = {
                isMore: isMore == 1,
                book: books,
            };

            this.cache.set(cacheKey, result, 180);
            return this.buildResponse(true, result);
        } catch (error) {
            return this.handleError(error, 'search drama');
        }
    }

    async suggestSearch(keyword: string): Promise<ApiResponse> {
        try {
            if (!keyword || keyword.trim() === '') {
                return this.buildResponse(false, null, 'Keyword is required');
            }

            const cacheKey = `suggest_${keyword}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/search/suggest', { keyword });

            const suggestList = data?.data?.suggestList || [];
            const results = suggestList.map((item: any) => ({
                bookId: item.bookId,
                bookName: item.bookName.replace(/\s+/g, '-'),
                cover: item.cover,
                introduction: item.introduction,
            }));

            this.cache.set(cacheKey, results, 180);
            return this.buildResponse(true, results);
        } catch (error) {
            return this.handleError(error, 'search suggest');
        }
    }

    async batchDownload(bookId: string): Promise<ApiResponse> {
        try {
            if (!bookId) {
                return this.buildResponse(false, null, 'Book ID is required');
            }

            const cacheKey = `batch_${bookId}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            let result: any[] = [];
            let totalChapters = 0;

            const fetchBatch = async (index: number, retryCount: number = 0): Promise<any> => {
                try {
                    const data = await this.request('/drama-box/chapterv2/batch/load', {
                        boundaryIndex: 0,
                        comingPlaySectionId: -1,
                        index: index,
                        currencyPlaySourceName: '首页发现_Untukmu_推荐列表',
                        rid: '',
                        enterReaderChapterIndex: 0,
                        loadDirection: 1,
                        startUpKey: '10942710-5e9e-48f2-8927-7c387e6f5fac',
                        bookId: bookId,
                        currencyPlaySource: 'discover_175_rec',
                        needEndRecommend: 0,
                        preLoad: false,
                        pullCid: '',
                    });
                    return data;
                } catch (error: any) {
                    if (retryCount < 2) {
                        await this.delay(2000);
                        return fetchBatch(index, retryCount + 1);
                    }
                    throw error;
                }
            };

            const firstBatchData = await fetchBatch(1);
            if (firstBatchData?.data) {
                totalChapters = firstBatchData.data.chapterCount || 0;

                if (firstBatchData.data.chapterList) {
                    result.push(...firstBatchData.data.chapterList);
                }

                let currentIdx = 6;
                while (currentIdx <= totalChapters) {
                    const batchData = await fetchBatch(currentIdx);
                    const items = batchData?.data?.chapterList || [];
                    if (items.length > 0) {
                        result.push(...items);
                        currentIdx += 5;
                    } else {
                        currentIdx += 5;
                    }
                    await this.delay(1000);
                }
            }

            const uniqueMap = new Map<string, any>();
            result.forEach((item: any) => uniqueMap.set(item.chapterId, item));

            const finalResult = Array.from(uniqueMap.values())
                .sort((a: any, b: any) => (a.chapterIndex || 0) - (b.chapterIndex || 0))
                .map((ch: any) => {
                    let cdn = ch.cdnList?.find((c: any) => c.isDefault === 1) || ch.cdnList?.[0];
                    let videoPath = 'N/A';
                    if (cdn?.videoPathList) {
                        const preferred = cdn.videoPathList.find((v: any) => v.isDefault === 1) ||
                            cdn.videoPathList.find((v: any) => v.quality === 1080) ||
                            cdn.videoPathList.find((v: any) => v.quality === 720) ||
                            cdn.videoPathList[0];
                        videoPath = preferred?.videoPath || 'N/A';
                    }

                    return {
                        chapterId: ch.chapterId,
                        chapterIndex: ch.chapterIndex,
                        chapterName: ch.chapterName,
                        videoPath: videoPath,
                    };
                });

            const responseData: BatchDownloadResponse = {
                bookId,
                totalEpisodes: finalResult.length,
                episodes: finalResult,
            };

            this.cache.set(cacheKey, responseData, 600);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'batch download');
        }
    }

    async getDramaDetailV2(bookId: string): Promise<ApiResponse> {
        try {
            if (!bookId) {
                return this.buildResponse(false, null, 'Book ID is required');
            }

            const cacheKey = `detailv2_${bookId}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request(
                `/webfic/book/detail/v2?id=${bookId}&language=${this.language}`,
                { id: bookId, language: this.language },
                true,
                'GET'
            );

            const { chapterList, book } = data?.data || {};
            const chapters: Array<{ index: number; id: string }> = [];
            
            chapterList?.forEach((ch: any) => {
                chapters.push({ index: ch.index, id: ch.id });
            });

            const result = { chapters, drama: book };
            this.cache.set(cacheKey, result, 600);
            return this.buildResponse(true, result);
        } catch (error) {
            return this.handleError(error, 'fetch drama detail v2');
        }
    }

    async advancedSearch(
        keyword?: string,
        filters?: {
            type?: string;
            status?: string;
            sort?: string;
            pageNo?: number;
            pageSize?: number;
        }
    ): Promise<ApiResponse> {
        try {
            const pageNo = filters?.pageNo || 1;
            const pageSize = filters?.pageSize || 20;
            const cacheKey = `advsearch_${keyword}_${JSON.stringify(filters)}_${this.language}`;
            
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            let data;
            if (keyword) {
                data = await this.request('/drama-box/search/search', {
                    searchSource: '搜索按钮',
                    pageNo,
                    pageSize,
                    from: 'search_sug',
                    keyword,
                });
            } else {
                data = await this.request('/drama-box/he001/classify', {
                    typeList: filters?.type ? [{ type: 1, value: filters.type }] : [],
                    showLabels: false,
                    pageNo: pageNo.toString(),
                    pageSize: pageSize.toString(),
                }, false, 'POST');
            }

            const rawResult = data?.data?.searchList || data?.data?.classifyBookList?.records || [];
            const isMore = data?.data?.isMore || data?.data?.classifyBookList?.isMore || 0;

            const books = rawResult.map((book: any) => ({
                id: book.bookId,
                name: book.bookName,
                cover: book.cover || book.coverWap,
                introduction: book.introduction,
                tags: book.tagNames || book.tagV3s || [],
                playCount: book.playCount,
                chapterCount: book.chapterCount,
            }));

            const result = {
                isMore: isMore == 1,
                page: pageNo,
                pageSize: pageSize,
                total: books.length,
                filters: filters,
                results: books
            };

            this.cache.set(cacheKey, result, 300);
            return this.buildResponse(true, result);
        } catch (error) {
            return this.handleError(error, 'advanced search');
        }
    }

    async getTrending(): Promise<ApiResponse> {
        try {
            const cacheKey = `trending_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const data = await this.request('/drama-box/he001/theater', {
                newChannelStyle: 1,
                isNeedRank: 1,
                pageNo: 1,
                index: 0,
                channelId: 175,
            });

            const columnVoList = data?.data?.columnVoList || [];
            const results: DramaItem[] = [];

            columnVoList.forEach((column: any) => {
                if (column.bookList && Array.isArray(column.bookList)) {
                    column.bookList.forEach((book: any) => {
                        results.push({
                            bookId: book.bookId,
                            bookName: book.bookName,
                            cover: book.cover,
                            coverWap: book.coverWap,
                            introduction: book.introduction,
                            chapterCount: book.chapterCount,
                            playCount: book.playCount,
                            tagV3s: book.tagV3s || [],
                            corner: book.corner,
                        });
                    });
                }
            });

            const responseData = {
                total: results.length,
                results: results.slice(0, 20)
            };

            this.cache.set(cacheKey, responseData, 300);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch trending');
        }
    }

    async getHomepage(): Promise<ApiResponse> {
        try {
            const cacheKey = `homepage_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const [latest, trending, recommended] = await Promise.all([
                this.getLatest(1),
                this.getTrending(),
                this.getRecommendedBooks()
            ]);

            const responseData = {
                latest: latest.data,
                trending: trending.data,
                recommended: recommended.data,
                timestamp: Date.now()
            };

            this.cache.set(cacheKey, responseData, 300);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch homepage');
        }
    }

    async getRelatedDramas(bookId: string): Promise<ApiResponse> {
        try {
            if (!bookId) {
                return this.buildResponse(false, null, 'Book ID is required');
            }

            const cacheKey = `related_${bookId}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const detail = await this.getDramaDetail(bookId);
            if (!detail.success || !detail.data) {
                return this.buildResponse(false, null, 'Failed to get drama detail');
            }

            const recommendations = detail.data.recommendations || [];
            const responseData = {
                bookId,
                total: recommendations.length,
                results: recommendations.slice(0, 10)
            };

            this.cache.set(cacheKey, responseData, 600);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch related dramas');
        }
    }

    async getEpisodeDetails(bookId: string, episodeIndex: number): Promise<ApiResponse> {
        try {
            if (!bookId || !episodeIndex) {
                return this.buildResponse(false, null, 'Book ID and episode index are required');
            }

            const cacheKey = `episode_${bookId}_${episodeIndex}_${this.language}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return this.buildResponse(true, cached);
            }

            const chapters = await this.getChapters(bookId);
            if (!chapters.success || !chapters.data) {
                return this.buildResponse(false, null, 'Failed to get chapters');
            }

            const chapter = chapters.data.chapters.find((c: ChapterItem) => c.chapterIndex === episodeIndex);
            if (!chapter) {
                return this.buildResponse(false, null, 'Episode not found');
            }

            const stream = await this.getStreamUrl(bookId, episodeIndex);
            
            const responseData = {
                bookId,
                episode: {
                    index: chapter.chapterIndex,
                    name: chapter.chapterName,
                    cover: chapter.cover,
                    duration: chapter.duration,
                    videoPath: chapter.videoPath,
                    stream: stream.data
                },
                nextEpisode: chapters.data.chapters.find((c: ChapterItem) => c.chapterIndex === episodeIndex + 1),
                prevEpisode: chapters.data.chapters.find((c: ChapterItem) => c.chapterIndex === episodeIndex - 1)
            };

            this.cache.set(cacheKey, responseData, 600);
            return this.buildResponse(true, responseData);
        } catch (error) {
            return this.handleError(error, 'fetch episode details');
        }
    }

    clearCache(): ApiResponse {
        this.cache.flushAll();
        this.tokenCache = null;
        return this.buildResponse(true, null, 'Cache cleared successfully');
    }

    getCacheStats(): ApiResponse {
        const stats = this.cache.getStats();
        return this.buildResponse(true, stats);
    }

    async getConfig(): Promise<ApiResponse> {
        const config = {
            language: this.language,
            version: this.version,
            timeout: this.timeout,
            maxRetries: this.maxRetries,
            requestDelay: this.requestDelay,
            baseUrl: this.baseUrl,
            webficUrl: this.webficUrl,
            userAgent: this.userAgent
        };
        
        return this.buildResponse(true, config);
    }

    async ping(): Promise<ApiResponse> {
        try {
            const token = await this.getToken();
            return this.buildResponse(true, {
                token: token.token.substring(0, 20) + '...',
                deviceId: token.deviceId,
                expiry: new Date(token.expiry).toISOString(),
                timestamp: Date.now()
            });
        } catch (error) {
            return this.handleError(error, 'ping');
        }
    }
}

export default DramaboxScraper;

if (typeof window !== 'undefined') {
    (window as any).DramaboxScraper = DramaboxScraper;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DramaboxScraper;
    module.exports.default = DramaboxScraper;
}
