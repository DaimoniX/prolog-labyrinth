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



% get_all_visited_adjacent(+Visited, +Width, +Height, -Result)
% function that returns all adjacent points to visited cells
get_all_visited_adjacent(Visited, Width, Height, Result) :-
    get_all_visited_adjacent_helper(Visited, Visited, Width, Height, [], Result), !.

% get_all_visited_adjacent_helper(+Visited, +Visited, +Width, +Height, +Accumulator, -Result)
% helper function for get_all_visited_adjacent
get_all_visited_adjacent_helper([], _, _, _, Result, Result) :- !.
get_all_visited_adjacent_helper([Point | Rest], Visited, Width, Height, Accumulator, Result) :-
    adjacent_bounded(Point, Width, Height, Adjacent),
    findall(Adj, (member(Adj, Adjacent), not(member(Adj, Accumulator)), not(member(Adj, Visited))), Temp),
    append(Accumulator, Temp, Temp2),
    get_all_visited_adjacent_helper(Rest, Visited, Width, Height, Temp2, Result).



% minimal_danger(+Knowledge, +Visited, +Width, +Height, -Point)
% function that returns the next point to visit
% find points adjacent to visited cells, bound them, and return the one with the lowest danger
minimal_danger(Knowledge, Visited, Width, Height, Point) :-
    get_all_visited_adjacent(Visited, Width, Height, Adjacent),
    findall(Danger, (member(Point, Adjacent), get_2d_val(Knowledge, Point, PossiblePoint), calculate_point_danger(PossiblePoint, Danger)), Dangers),
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
