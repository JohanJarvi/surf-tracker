import { Collection, MongoClient, ServerApiVersion } from "mongodb";

export type Day = {
    date: string;
    surfed?: boolean;
    sickOrInjured?: boolean;
    restDay?: boolean;
}

type SurfDaysData = {
  daysSurfed: Day[];
};

const client = new MongoClient(process.env.MONGODB_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const getSurfDays = async (): Promise<SurfDaysData | undefined> => {
  try {
    await client.connect();
    const collection: Collection<Day> = client.db("surfdays").collection<Day>("days");
    const documents = await collection.find().toArray();
    const surfdays = documents.map<Day>((document) => ({date: document.date, surfed: document.surfed, sickOrInjured: document.sickOrInjured, restDay: document.restDay}))

    return {daysSurfed: surfdays}
  } catch (err) {
    console.error(`Failed to connect to DB: '${err}'`);
  }
};
