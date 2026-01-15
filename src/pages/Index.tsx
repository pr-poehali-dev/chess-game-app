import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | null;
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];

const pieceEmojis: Record<string, string> = {
  'white-king': '♔',
  'white-queen': '♕',
  'white-rook': '♖',
  'white-bishop': '♗',
  'white-knight': '♘',
  'white-pawn': '♙',
  'black-king': '♚',
  'black-queen': '♛',
  'black-rook': '♜',
  'black-bishop': '♝',
  'black-knight': '♞',
  'black-pawn': '♟',
};

const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill({ type: 'pawn', color: 'black' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'pawn', color: 'white' }),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

const tournaments = [
  { id: 1, name: 'Чемпионат мира по блицу', players: 128, prize: '₽500,000', status: 'active', time: '3+2' },
  { id: 2, name: 'Гроссмейстерский турнир', players: 64, prize: '₽250,000', status: 'registration', time: '15+10' },
  { id: 3, name: 'Молниеносный марафон', players: 256, prize: '₽150,000', status: 'active', time: '1+0' },
  { id: 4, name: 'Классический турнир', players: 32, prize: '₽100,000', status: 'upcoming', time: '30+0' },
];

const lessons = [
  { id: 1, title: 'Мат в 2 хода', difficulty: 'easy', rating: 1200, solved: 1543, category: 'Тактика' },
  { id: 2, title: 'Королевский гамбит', difficulty: 'medium', rating: 1600, solved: 892, category: 'Дебют' },
  { id: 3, title: 'Ладейный эндшпиль', difficulty: 'hard', rating: 1900, solved: 421, category: 'Эндшпиль' },
  { id: 4, title: 'Вилка конём', difficulty: 'easy', rating: 1100, solved: 2134, category: 'Тактика' },
];

const gameHistory = [
  { id: 1, opponent: 'GM_Magnus', result: 'win', moves: 42, rating: 2850, date: '15.01.2026', opening: 'Сицилианская защита' },
  { id: 2, opponent: 'IM_Petrov', result: 'draw', moves: 67, rating: 2650, date: '14.01.2026', opening: 'Итальянская партия' },
  { id: 3, opponent: 'FM_Ivanov', result: 'loss', moves: 38, rating: 2400, date: '13.01.2026', opening: 'Испанская партия' },
  { id: 4, opponent: 'CM_Sidorov', result: 'win', moves: 28, rating: 2200, date: '12.01.2026', opening: 'Французская защита' },
];

const Index = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState('board');

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = newBoard[selectedRow][selectedCol];
      newBoard[selectedRow][selectedCol] = null;
      setBoard(newBoard);
      setSelectedSquare(null);
    } else if (board[row][col]) {
      setSelectedSquare([row, col]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-400';
      case 'draw': return 'text-yellow-400';
      case 'loss': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                ChessMaster Pro
              </h1>
              <p className="text-muted-foreground text-lg">Играй. Учись. Побеждай.</p>
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                <Icon name="Play" size={20} className="mr-2" />
                Быстрая игра
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30">
                <Icon name="Users" size={20} className="mr-2" />
                Онлайн
              </Button>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-card/50 backdrop-blur">
            <TabsTrigger value="board" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary">
              <Icon name="Grid3x3" size={20} className="mr-2" />
              Доска
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary">
              <Icon name="Trophy" size={20} className="mr-2" />
              Турниры
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary">
              <Icon name="GraduationCap" size={20} className="mr-2" />
              Уроки
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary">
              <Icon name="History" size={20} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="animate-slide-up">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-2xl">Шахматная доска</CardTitle>
                  <CardDescription>Кликните на фигуру, затем на целевое поле</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="inline-block p-4 bg-muted/30 rounded-2xl">
                    <div className="grid grid-cols-8 gap-0 border-4 border-primary/30 rounded-xl overflow-hidden shadow-2xl">
                      {board.map((row, rowIndex) =>
                        row.map((piece, colIndex) => {
                          const isLight = (rowIndex + colIndex) % 2 === 0;
                          const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                          return (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleSquareClick(rowIndex, colIndex)}
                              className={`
                                w-16 h-16 flex items-center justify-center text-5xl transition-all duration-200
                                ${isLight ? 'bg-primary/20' : 'bg-primary/40'}
                                ${isSelected ? 'ring-4 ring-accent scale-95' : 'hover:scale-105 hover:shadow-lg'}
                                ${piece ? 'cursor-pointer' : ''}
                              `}
                            >
                              {piece && pieceEmojis[`${piece.color}-${piece.type}`]}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-secondary/20 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Clock" size={24} className="text-secondary" />
                      Время
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
                        <span className="text-muted-foreground">Белые</span>
                        <span className="text-3xl font-bold text-primary">10:00</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl">
                        <span className="text-muted-foreground">Чёрные</span>
                        <span className="text-3xl font-bold text-secondary">10:00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent/20 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Zap" size={24} className="text-accent" />
                      Статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Рейтинг</span>
                      <span className="font-bold text-accent">2450</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Побед</span>
                      <span className="font-bold text-green-400">342</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Поражений</span>
                      <span className="font-bold text-red-400">156</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              {tournaments.map((tournament, index) => (
                <Card key={tournament.id} className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-all hover:scale-[1.02] animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{tournament.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Icon name="Users" size={16} />
                          {tournament.players} игроков
                        </CardDescription>
                      </div>
                      <Badge className={
                        tournament.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        tournament.status === 'registration' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }>
                        {tournament.status === 'active' ? 'Идёт' : tournament.status === 'registration' ? 'Регистрация' : 'Скоро'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Trophy" size={20} className="text-yellow-400" />
                        <span className="text-xl font-bold text-yellow-400">{tournament.prize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={20} className="text-accent" />
                        <span className="text-muted-foreground">{tournament.time}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      {tournament.status === 'active' ? 'Смотреть' : tournament.status === 'registration' ? 'Зарегистрироваться' : 'Уведомить'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="animate-slide-up">
            <div className="grid md:grid-cols-2 gap-6">
              {lessons.map((lesson, index) => (
                <Card key={lesson.id} className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-all hover:scale-[1.02] animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{lesson.title}</CardTitle>
                      <Badge className={getDifficultyColor(lesson.difficulty)}>
                        {lesson.difficulty === 'easy' ? 'Легко' : lesson.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Tag" size={16} />
                        {lesson.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Users" size={16} />
                        {lesson.solved} решений
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Star" size={20} className="text-yellow-400" />
                        <span className="text-xl font-bold">{lesson.rating}</span>
                      </div>
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        <Icon name="Play" size={16} className="mr-2" />
                        Начать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-slide-up">
            <div className="space-y-4">
              {gameHistory.map((game, index) => (
                <Card key={game.id} className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-all hover:scale-[1.01] animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getResultColor(game.result)}`}>
                            {game.result === 'win' ? '1-0' : game.result === 'draw' ? '½-½' : '0-1'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {game.result === 'win' ? 'Победа' : game.result === 'draw' ? 'Ничья' : 'Поражение'}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="User" size={18} className="text-primary" />
                            <span className="font-bold text-lg">{game.opponent}</span>
                            <Badge className="bg-accent/20 text-accent">{game.rating}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Icon name="BookOpen" size={14} />
                              {game.opening}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Hash" size={14} />
                              {game.moves} ходов
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{game.date}</span>
                        <Button variant="outline" className="border-primary/30">
                          <Icon name="Eye" size={16} className="mr-2" />
                          Анализ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
