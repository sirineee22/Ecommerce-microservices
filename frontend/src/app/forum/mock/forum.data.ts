import type { Category, Discussion, ForumMember } from '../models/discussion.model';

export const FORUM_CATEGORIES: Category[] = [
  { id: 'achats-ventes', name: 'Achats & Ventes', icon: 'check', count: 342 },
  { id: 'livraison', name: 'Livraison', icon: 'truck', count: 128 },
  { id: 'paiements', name: 'Paiements', icon: 'card', count: 87 },
  { id: 'securite', name: 'Sécurité', icon: 'shield', count: 56 },
  { id: 'aide', name: 'Aide', icon: 'info', count: 214 },
  { id: 'tendances', name: 'Tendances', icon: 'chart', count: 95 },
];

export const FORUM_DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    title: 'Comment vérifier l\'authenticité d\'un vendeur sur la marketplace?',
    excerpt: 'Je viens de commander un smartphone et je me demande quels sont les signes à surveiller...',
    categoryId: 'achats-ventes',
    author: { id: '1', name: 'Sophie M.', initials: 'SM' },
    createdAt: 'il y a 2h',
    upvotes: 124,
    comments: 47,
    views: 1823,
    badge: 'pinned',
  },
  {
    id: '2',
    title: 'Retours gratuits: comment ça marche?',
    excerpt: 'Quelqu\'un peut m\'expliquer la procédure pour retourner un article sans frais?',
    categoryId: 'livraison',
    author: { id: '2', name: 'Lucas D.', initials: 'LD' },
    createdAt: 'il y a 5h',
    upvotes: 256,
    comments: 89,
    views: 3421,
    badge: 'hot',
  },
  {
    id: '3',
    title: 'Paiement par carte: délai de remboursement?',
    excerpt: 'J\'ai demandé un remboursement il y a 3 jours. Combien de temps faut-il?',
    categoryId: 'paiements',
    author: { id: '3', name: 'Amira K.', initials: 'AK' },
    createdAt: 'il y a 1j',
    upvotes: 89,
    comments: 34,
    views: 987,
    badge: 'new',
  },
  {
    id: '4',
    title: 'Livraison express disponible en Tunisie?',
    excerpt: 'Est-ce que MyShop propose la livraison en 24h dans les grandes villes?',
    categoryId: 'livraison',
    author: { id: '4', name: 'Thomas R.', initials: 'TR' },
    createdAt: 'il y a 1j',
    upvotes: 342,
    comments: 112,
    views: 4521,
    badge: 'popular',
  },
  {
    id: '5',
    title: 'Escroquerie: comment signaler un vendeur?',
    excerpt: 'J\'ai reçu un produit différent de la description. Comment signaler?',
    categoryId: 'securite',
    author: { id: '5', name: 'Léa P.', initials: 'LP' },
    createdAt: 'il y a 2j',
    upvotes: 198,
    comments: 67,
    views: 2134,
  },
];

export const TOP_MEMBERS: ForumMember[] = [
  { rank: 1, id: '1', name: 'Sophie M.', initials: 'SM', points: 2847 },
  { rank: 2, id: '2', name: 'Lucas D.', initials: 'LD', points: 2134 },
  { rank: 3, id: '3', name: 'Amira K.', initials: 'AK', points: 1892 },
  { rank: 4, id: '4', name: 'Thomas R.', initials: 'TR', points: 1654 },
  { rank: 5, id: '5', name: 'Léa P.', initials: 'LP', points: 1423 },
];

export const TRENDING_TAGS = [
  '#dropshipping',
  '#crypto-paiement',
  '#livraison-express',
  '#retours-gratuits',
  '#verified-seller',
  '#deals-flash',
];
