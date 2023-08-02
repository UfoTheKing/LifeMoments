import axios from "axios";
import { EmojiItemProp } from "react-native-reactions/lib/components/ReactionView/types";

export const ReactionItems: EmojiItemProp[] = [
  {
    id: 0,
    emoji: "😇",
    title: "like",
  },
  {
    id: 1,
    emoji: "🥰",
    title: "love",
  },
  {
    id: 2,
    emoji: "🤗",
    title: "care",
  },
  {
    id: 3,
    emoji: "😘",
    title: "kiss",
  },
  {
    id: 4,
    emoji: "😂",
    title: "laugh",
  },
  {
    id: 5,
    emoji: "😎",
    title: "cool",
  },
];

export const Comments = [];

export const Captions = [
  {
    did_report_as_spam: false,
    share_enabled: false,
    is_covered: false,
    is_ranked_comment: false,
    media_id: "3158335621536835833",
    private_reply_status: 0,
    pk: "17894111747792002",
    user_id: "6978073057",
    type: 1,
    text: "Nicky al GIFFONI FILM FESTIVAL🥳😎\n\nQuest’anno sono stata invitata due volte, la prima con @deakidstv per presentare la seconda stagione di MUSIC DISTRACTION (un programma per bambini a cui stiamo lavorando) e la seconda con @ringo , brand con cui collaboro da sei mesi a questa parte. \nSono davvero fiera di tutti i progetti a cui sto lavorando ultimamente, sto facendo esperienze che non avrei mai pensato di fare. \nSo che siete abituati ai miei Copy e ad una me un po’ scemotti, ma ci tenevo a dire che sono davvero felice, soddisfatta e fiera di tutto questo. \n\ngrazie grazissimo a @pinkoofficial per il vestito e la borsa che AMO",
    created_at: 1690722969,
    created_at_utc: 1690722969,
    content_type: "comment",
    status: "Active",
    bit_flags: 0,
  },
  {
    did_report_as_spam: false,
    share_enabled: false,
    is_covered: false,
    is_ranked_comment: false,
    media_id: "3145622101737125166",
    private_reply_status: 0,
    pk: "18063159442409181",
    user_id: "5216917",
    type: 1,
    text: "Margot Robbie \n@barbiethemovie London photo call\nWearing @dilarafindikoglu \nStyling @andrewmukamal \nMakeup @patidubroff \nManicure @michelleclassnails",
    created_at: 1689207399,
    created_at_utc: 1689207399,
    content_type: "comment",
    status: "Active",
    bit_flags: 0,
    has_translation: true,
  },
];

export const FetchPhotos = async () => {
  let url = "https://api.slingacademy.com/v1/sample-data/photos";

  const response = await axios.get(url);

  let photos = response.data.photos;

  let data = photos.map((photo: any) => {
    let urlUser = `https://api.slingacademy.com/v1/sample-data/users/${photo.user}`;

    let randomAvatars = [
      "https://www.w3schools.com/howto/img_avatar.png",
      "https://www.w3schools.com/howto/img_avatar2.png",
      "https://www.w3schools.com/howto/img_avatar3.png",
    ];

    let randomUsernames = [
      "John Doe",
      "Jane Doe",
      "John Smith",
      "Jane Smith",
      "John Johnson",
      "Jane Johnson",
      "John Williams",
      "Jane Williams",
      "John Brown",
      "Jane Brown",
      "John Jones",
      "Jane Jones",
      "John Miller",
    ];

    let randomPlaces = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
      "Austin",
      "Jacksonville",
    ];
    let randomPost = [
      "2 hr ago",
      "3 hr ago",
      "4 hr ago",
      "5 hr ago",
      "6 hr ago",
      "7 hr ago",
      "8 hr ago",
      "9 hr ago",
      "10 hr ago",
    ];
    photo.location =
      randomPlaces[Math.floor(Math.random() * randomPlaces.length)];
    photo.posted = randomPost[Math.floor(Math.random() * randomPost.length)];
    photo.username =
      randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
    photo.avatar =
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    photo.userIsVerified = Math.random() >= 0.5;
    photo.reaction =
      Math.random() >= 0.5
        ? ReactionItems[Math.floor(Math.random() * 6)]
        : null;

    photo.commentsCount = Math.floor(Math.random() * 100);
    photo.caption = Captions[Math.floor(Math.random() * Captions.length)];

    return photo;
  });

  return data;
};
