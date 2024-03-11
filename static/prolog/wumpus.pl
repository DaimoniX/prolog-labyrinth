% JavaScript -> Prolog
% Point: V2 { x: number, y: number } -> [X, Y]


% function that returns all adjacent points to a given point
% adjacent(+Point, -AdjacentList)
adjacent(Point, AdjacentList) :-
    Point = [X, Y],
    X1 is X + 1,
    X2 is X - 1,
    Y1 is Y + 1,
    Y2 is Y - 1,
    AdjacentList = [[X1, Y], [X2, Y], [X, Y1], [X, Y2]].

% function that is point is within the bounds of the grid
bounded(Point, Width, Height) :-
    Point = [X, Y],
    X >= 0,
    X < Width,
    Y >= 0,
    Y < Height.

% adjecent points that are within the bounds of the grid
adjacent_bounded(Point, Width, Height, Adjacent) :-
    adjacent(Point, AdjacentUnbounded),
    findall(Adj, (member(Adj, AdjacentUnbounded), bounded(Adj, Width, Height)), Adjacent).

