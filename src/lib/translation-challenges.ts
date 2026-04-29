import type { GenerateTranslationChallengeInput } from '@/ai/flows/translation-schema';

export type TranslationChallenge = {
    id: number;
    topic: string;
    level: string;
    chineseText: string;
    pinyin: string;
    vietnamese: string;
};

const challenges: TranslationChallenge[] = [
    {
        id: 1,
        topic: 'Đời sống',
        level: 'HSK 3',
        chineseText: '今天天气真好，我们去公园散步吧。公园里有很多花，还有很多人在放风筝。',
        pinyin: 'Jīntiān tiānqì zhēn hǎo, wǒmen qù gōngyuán sànbù ba. Gōngyuán lǐ yǒu hěn duō huā, hái yǒu hěn duō rén zài fàng fēngzhēng.',
        vietnamese: 'Thời tiết hôm nay đẹp thật, chúng ta đi công viên dạo đi. Trong công viên có rất nhiều hoa, còn có rất nhiều người đang thả diều.'
    },
    {
        id: 2,
        topic: 'Công việc',
        level: 'HSK 4',
        chineseText: '为了完成这个项目，我们团队的每个人都付出了很多努力，经常加班加点。希望我们的辛苦能换来一个好结果。',
        pinyin: 'Wèile wánchéng zhège xiàngmù, wǒmen tuánduì de měi ge rén dōu fùchūle hěn duō nǔlì, jīngcháng jiābān jiādiǎn. Xīwàng wǒmen de xīnkǔ néng huànlái yí ge hǎo jiéguǒ.',
        vietnamese: 'Để hoàn thành dự án này, mỗi người trong nhóm chúng tôi đều đã nỗ lực rất nhiều, thường xuyên tăng ca. Hy vọng sự vất vả của chúng tôi có thể đổi lại một kết quả tốt.'
    },
    {
        id: 3,
        topic: 'Du lịch',
        level: 'HSK 3',
        chineseText: '我计划下个月去北京旅游。我想去看看长城和故宫，还想尝尝北京烤鸭。',
        pinyin: 'Wǒ jìhuà xià ge yuè qù Běijīng lǚyóu. Wǒ xiǎng qù kànkan Chángchéng hé Gùgōng, hái xiǎng chángchang Běijīng kǎoyā.',
        vietnamese: 'Tôi dự định tháng sau đi du lịch Bắc Kinh. Tôi muốn đi xem Vạn Lý Trường Thành và Cố Cung, còn muốn nếm thử vịt quay Bắc Kinh.'
    },
    {
        id: 4,
        topic: 'Công nghệ',
        level: 'HSK 5',
        chineseText: '随着科技的飞速发展，智能手机已经成为我们生活中不可或缺的一部分。它不仅改变了我们的沟通方式，也影响着我们的工作和娱乐。',
        pinyin: 'Suízhe kējì de fēisù fāzhǎn, zhìnéng shǒujī yǐjīng chéngwéi wǒmen shēnghuó zhōng bùkě huòquē de yí bùfen. Tā bùjǐn gǎibiànle wǒmen de gōutōng fāngshì, yě yǐngxiǎngzhe wǒmen de gōngzuò hé yúlè.',
        vietnamese: 'Cùng với sự phát triển nhanh chóng của công nghệ, điện thoại thông minh đã trở thành một phần không thể thiếu trong cuộc sống của chúng ta. Nó không chỉ thay đổi cách chúng ta giao tiếp mà còn ảnh hưởng đến công việc và giải trí của chúng ta.'
    },
    {
        id: 5,
        topic: 'Văn hóa',
        level: 'HSK 4',
        chineseText: '中国的春节是一个非常重要的传统节日。家家户户都会团聚在一起，吃年夜饭，放鞭炮，庆祝新年的到来。',
        pinyin: 'Zhōngguó de Chūnjié shì yí ge fēicháng zhòngyào de chuántǒng jiérì. Jiājiāhùhù dōu huì tuánjù zài yìqǐ, chī niányèfàn, fàng biānpào, qìngzhù xīnnián de dàolái.',
        vietnamese: 'Tết Nguyên Đán của Trung Quốc là một ngày lễ truyền thống rất quan trọng. Mọi nhà đều sẽ sum họp bên nhau, ăn bữa cơm tất niên, đốt pháo để chào mừng năm mới đến.'
    }
];

export function getStaticTranslationChallenge(input: GenerateTranslationChallengeInput): TranslationChallenge | null {
    const filteredChallenges = challenges.filter(c => c.topic === input.topic && c.level === input.level);
    if (filteredChallenges.length > 0) {
        return filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];
    }
    
    const byTopic = challenges.filter(c => c.topic === input.topic);
    if (byTopic.length > 0) {
        return byTopic[Math.floor(Math.random() * byTopic.length)];
    }

    const byLevel = challenges.filter(c => c.level === input.level);
    if (byLevel.length > 0) {
        return byLevel[Math.floor(Math.random() * byLevel.length)];
    }

    if (challenges.length > 0) {
        return challenges[Math.floor(Math.random() * challenges.length)];
    }

    return null;
}

export function findChallengeByText(chineseText: string): TranslationChallenge | undefined {
    return challenges.find(c => c.chineseText === chineseText);
}
