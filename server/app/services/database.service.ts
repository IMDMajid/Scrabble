/* eslint-disable @typescript-eslint/ban-types */
import { AiType } from '@common/ai-name';
import { AI_BEGINNERS, AI_EXPERTS, DATABASE_URL, DEFAULT_SCORES } from '@app/classes/constants';
import { BEGINNER_NAME_MODEL, EXPERT_NAME_MODEL, SCORES_MODEL, AI_MODELS, DbModel } from '@app/classes/database.schema';
import { GameType } from '@common/game-type';
import { PlayerScore } from '@common/player';
import * as mongoose from 'mongoose';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    async start(url: string = DATABASE_URL): Promise<void> {
        await mongoose
            .connect(url, this.options)
            .then(() => {
                // JUSTIFICATION : required in order to display the DB connection status
                // eslint-disable-next-line no-console
                console.log('Connected successfully to Mongodb Atlas');
            })
            .catch(() => {
                throw new Error('Distant database connection error');
            });

        this.setDefaultData(AiType.beginner);
        this.setDefaultData(AiType.expert);

        this.setDefaultScores(GameType.Classic);
        this.setDefaultScores(GameType.Log2990);
    }

    async closeConnection(): Promise<void> {
        await mongoose.connection.close();
    }
    async setDefaultScores(gameType: GameType): Promise<void> {
        const scoresModel = SCORES_MODEL.get(gameType) as mongoose.Model<PlayerScore>;
        await scoresModel.deleteMany({ isDefault: true }).exec();
        for (const player of DEFAULT_SCORES) {
            const scoreToAdd = new scoresModel({
                score: player.score,
                playerName: player.playerName,
                isDefault: player.isDefault,
            });
            await scoreToAdd.save();
        }
    }

    async setDefaultData(aiEnum: number): Promise<void> {
        const aiModel = AI_MODELS.get(aiEnum) as DbModel;
        await aiModel.deleteMany({ isDefault: true }).exec();

        const players = aiEnum ? AI_EXPERTS : AI_BEGINNERS;
        for (const aiPlayer of players) {
            const player = new aiModel({
                aiName: aiPlayer.aiName,
                isDefault: aiPlayer.isDefault,
            });
            await player.save();
        }
    }

    async resetScores(gameType: GameType): Promise<void> {
        const scoresModel = SCORES_MODEL.get(gameType) as mongoose.Model<PlayerScore>;
        await scoresModel.deleteMany({ isDefault: false }).exec();
    }

    async resetData(): Promise<void> {
        await BEGINNER_NAME_MODEL.deleteMany({ isDefault: false }).exec();
        await EXPERT_NAME_MODEL.deleteMany({ isDefault: false }).exec();
        // TODO supprimer dictionnaires
    }
}
