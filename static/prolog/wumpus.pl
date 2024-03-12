% JavaScript -> Prolog
% Point: V2 { x: number, y: number } -> [X, Y]
% Perceptions: AiTileData -> [Wumpus, Pit, Gold]


% =================================================================================================
%
%   Main function
%
% =================================================================================================



% adjacent(+Point, -AdjacentList)
% function that returns all adjacent points to a given point
adjacent(Point, AdjacentList) :-
    Point = [X, Y],
    X1 is X + 1,
    X2 is X - 1,
    Y1 is Y + 1,
    Y2 is Y - 1,
    AdjacentList = [[X1, Y], [X, Y1], [X2, Y], [X, Y2]].
/*
Example:
?- adjacent([1, 1], AdjacentList).
AdjacentList = [[2, 1], [0, 1], [1, 2], [1, 0]].
*/



% is_adjacent(+Point1, +Point2)
% function that checks if two points are adjacent
is_adjacent(Point1, Point2) :-
    adjacent(Point1, AdjacentList),
    member(Point2, AdjacentList).


% bounded(+Point, +Width, +Height)
% function that is point is within the bounds of the grid
bounded(Point, Width, Height) :-
    Point = [X, Y],
    X >= 0,
    X < Width,
    Y >= 0,
    Y < Height.
/*
Example:
?- bounded([1, 1], 2, 2).
true.
*/



% adjacent_bounded(+Point, +Width, +Height, -Adjacent)
% adjecent points that are within the bounds of the grid
adjacent_bounded(Point, Width, Height, Adjacent) :-
    adjacent(Point, AdjacentUnbounded),
    findall(Adj, (member(Adj, AdjacentUnbounded), bounded(Adj, Width, Height)), Adjacent).
/*
Example:
?- adjacent_bounded([1, 1], 2, 2, Adjacent).
Adjacent = [[0, 1], [1, 0]].
*/



% next_move(+Target, +Visited, -Move)
% function that returns the next move
next_move(From, Target, Visited, Move) :-
    astar(From, Target, Visited, Move).



% update_knowledge(+Knowledge, +Visited, +Width, +Height, +Point, +Perceptions, -NewKnowledge).
% function that updates the knowledge of the agent
update_knowledge(Knowledge, _, _, _, _, _, Knowledge).



% calculate_point_danger(+Point, -Danger)
% function that calculates the danger of a point
calculate_point_danger([Wumpus, Pit, Gold], Danger) :-
    Danger is Wumpus + Pit - Gold.
/*
Example:
?- calculate_point_danger([1, 1, 1], Danger).
Danger = 1.

?- calculate_point_danger([0, 0, 1], Danger).
Danger = -1.
*/



% find_all_adjacent_to_visited(+Visited, +Width, +Height, -Adjacent)
% function that returns all adjacent points to visited cells
find_all_adjacent_to_visited(Visited, Width, Height, Adjacent) :-
    findall(Adj, (member(Point, Visited), adjacent_bounded(Point, Width, Height, Adj), not(member(Adj, Visited))), Adjacent).



% minimal_danger(+Knowledge, +Visited, +Width, +Height, -Point)
% function that returns the next point to visit
% find points adjacent to visited cells, bound them, and return the one with the lowest danger
minimal_danger(Knowledge, Visited, Width, Height, Point) :-
    find_all_adjacent_to_visited(Visited, Width, Height, [Adjacent]),
    write(Adjacent),
    findall(Danger, (member(Point, Adjacent), get_2d_val(Knowledge, Point, PossiblePoint), calculate_point_danger(PossiblePoint, Danger)), Dangers),
    write(Dangers),
    min_list(Dangers, MinDanger),
    nth0(Index, Dangers, MinDanger),
    nth0(Index, Adjacent, Point), !.



% minimal_danger(Knowledge, Visited, Width, Height, Point) :-
%     findall([X, Y], (member([X, Y], Visited), adjacent_bounded([X, Y], Width, Height, Adjacent), member(Point, Adjacent)), AdjacentPoints),
%     findall(Danger, (member(Point, AdjacentPoints), get_2d_val(Knowledge, Point, PossiblePoint), calculate_point_danger(PossiblePoint, Danger)), Dangers),
%     min_list(Dangers, MinDanger),
%     nth0(Index, Dangers, MinDanger),
%     nth0(Index, AdjacentPoints, Point), !.


% next_target(+Knowledge, +Visited, +Width, +Height, -Target)
% function that returns the next cell to visit
next_target(Knowledge, Visited, Width, Height, Target) :-
    minimal_danger(Knowledge, Visited, Width, Height, Target).



% =================================================================================================
%
%   A* Algorithm
%
% =================================================================================================



% heuristic(+From, +To, -Heuristic)
% function that returns the heuristic distance between two points
heuristic([X1, Y1], [X2, Y2], Heuristic) :-
    Heuristic is abs(X1 - X2) + abs(Y1 - Y2).
/*
Example:
?- heuristic([1, 0], [3, 0], H).
H = 2.
*/



% astar(+Start, +Target, +AllowedPoints, -Path)
% Move only on visited tiles
% Create minimum possible amount of additional predicates
astar(Start, Target, AllowedPoints, Path) :-
    astar_helper(Start, Target, [Target | AllowedPoints], [Start], Path), !.
/*
Example:
?- astar([0, 0], [1, 1], [[0, 0], [1, 0], [1, 1]], Path)..
Path = [[0, 0], [1, 0], [1, 1]].
*/



% astar_helper(+Start, +Target, +AllowedPoints, +CurrentPath, -Path)
% Helper function for astar
astar_helper(Start, Start, _, Path, Path) :- !.
astar_helper(Start, Target, _, CurrentPath, Path) :- 
    adjacent(Start, AdjacentList),
    member(Target, AdjacentList),
    append(CurrentPath, [Target], Path), !.
astar_helper(Start, Target, AllowedPoints, CurrentPath, Path) :-
    astar_step(Start, Target, AllowedPoints, CurrentPath, Adjacent),
    append(CurrentPath, [Adjacent], NewPath),
    astar_helper(Adjacent, Target, AllowedPoints, NewPath, Path).



% astar_step(+Start, +Target, +AllowedPoints, +CurrentPath, -NextPoint)
% Function that returns the next point in the path
astar_step(Start, Start, _, _, Start) :- !.
astar_step(Start, Target, AllowedPoints, CurrentPath, NextPoint) :-
    adjacent(Start, AdjacentList),
    member(NextPoint, AdjacentList),
    member(NextPoint, AllowedPoints),
    not(member(NextPoint, CurrentPath)),
    heuristic(NextPoint, Target, Heuristic),
    not((member(OtherAdjacent, AdjacentList), member(OtherAdjacent, AllowedPoints), not(member(OtherAdjacent, CurrentPath)), heuristic(OtherAdjacent, Target, OtherHeuristic), Heuristic > OtherHeuristic)).







% =================================================================================================
%
%   Arrays and Matrices manipulation
%
% =================================================================================================



% get_array_val(++Array, +Index, -Result)
% Get the value of array at a given position
get_array_val(Array, Index, Result) :-
    nth0(Index, Array, Result).
/*
Example:
?- get_array_val([0, 1, 2, 3], 2, Result).
Result = 2.
*/



% set_array_val(++Array, +Index, +Value, -Result)
% Set the value of array at a given position
set_array_val(Array, Index, Value, Result) :-
    nth0(Index, Array, _, Temp),
    nth0(Index, Result, Value, Temp).
/*
Example:
?- set_array_val([0, 1, 2, 3], 2, 7, Result).
Result = [0, 1, 7, 3].
*/



% get_2d_val(++Matrix, ++Point, -Result)
% Get the value of a 2D matrix at a given position
get_2d_val(Matrix, [X, Y], Result) :-
    nth0(X, Matrix, Row),
    nth0(Y, Row, Result).
/*
Example:
?- get_2d_val([[[0, 0], [1, 0]], [[0, 1], [1, 1]]], [1, 1], Result).
Result = [1, 1].
*/



% Set the value of a 2D matrix at a given position
% Ex. Matrix: [[[0, 0], [1, 0]], [[0, 1], [1, 1]]], [1, 1], [7, 7], Result
% Result = [[[0, 0], [1, 0]], [[0, 1], [7, 7]]]
set_2d_val(Matrix, [X, Y], Value, Result) :-
    nth0(X, Matrix, Row),
    set_array_val(Row, Y, Value, Temp),
    set_array_val(Matrix, X, Temp, Result).
/*
Example:
?- set_2d_val([[[0, 0], [1, 0]], [[0, 1], [1, 1]]], [1, 1], [7, 7], Result).
Result = [[[0, 0], [1, 0]], [[0, 1], [7, 7]]].
*/
