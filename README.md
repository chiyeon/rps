# rps tournament
**rps tournament** is a full stack Rock Paper Scissors tournament application.

With a backend powered by express & socket.io, players can interact with the Vue3 powered frontend to create, join, and leave lobbies with as many players as they need, choosing custom names & entering any lobbies they wish. 

Once a lobby is chosen, the host and only the host can freely start whenever, a role that is automatically migrated to others when necessary.

After the tournament starts, matches are randomly created for each tier, up till the Finals. At any point if there is an odd number of players, one player will be randomly moved up to the next tier.
