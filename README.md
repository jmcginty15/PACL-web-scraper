# Pro Am Chess League API/Web Scraper

## Endpoints

### Clubs

`GET /clubs/:id`

Find a club by ID.

`{ club: Club }`

###### Club:

| Field | Type | Value |
| --- | --- | --- |
| id | str | Alphanumeric club ID of the form XDDDDDDD where X is a character from A-Z and D are digits from 0-9. `A6053737` |
| name | str | Club name. `PRO AM CHESS LEAGUE` |
| events | arr(Event) | Array of all events in the club's tournament history. |
| members | arr(Member) | Array of all USCF members who have participated in one of the club's events. |

###### Event:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer event ID. `202011283482` |
| name | str | Event name. `PACL 0106 PLEX POD ALL BELTS ALL CLASSES` |
| locationCity | str | Event location city and state. `LENEXA, KS` |
| locationZip | str | Event location zip code. `66215` |
| dates | str | Event dates. May be either a single date or a range of dates. `2020-11-28` or `2020-12-12 thru 2020-12-13` |
| chiefTd | int | ID of chief tournament director. `15068332` |
| sections | int | Number of sections. `1` |
| players | int | Number of players. `7` |

###### Member:

| Field | Type | Value |
| --- | --- | --- |
| id | int | Integer member ID. `30070111` |
| name | str | Member name. `JASON MCGINTY` |
| state | str | Member state. Null if unavailable. `KS` |
| gender | str | Member gender. Null if unavailable. `M` |
| expDate | str | Member's USCF membership expiration date. `2021-11-30` |
| lastChangeDate | str | Date of member's last official USCF rating change. `2021-07-01` |
| FIDEID | int | Integer FIDE ID. Null if not a FIDE member. `2049309` |
| FIDECountry | str | Country of FIDE registration. Null if not a FIDE member. `USA` |
| overallRank | str | Member's overall USCF ranking. Preceded by 'T' if tied with other members at the same ranking. `2972/10221` or `T2972/10221` |
| seniorRank | str | Member's USCF senior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if younger than 65. `65/699` or `T65/699` |
| juniorRank | str | Member's USCF junior ranking. Preceded by 'T' if tied with other members at the same ranking. Null if 21 or older. `2451/5342` or `T2451/5342` |
| femaleRank | str | Member's USCF female ranking. Preceded by 'T' if tied with other members at the same ranking. Null if male. `478/898` or `T478/898` |
| stateRank | str | Member's USCF state ranking. Preceded by 'T' if tied with other members at the same ranking. `28/106` or `T28/106` |
| ratingBlitz | str | Member's USCF Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Blitz games have been played. `1521` or `1521P23` or `Unrated` |
| ratingQuick | str | Member's USCF Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Quick games have been played. `1562` or `1562P20` or `Unrated` |
| ratingRegular | str | Member's USCF Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Regular games have been played. `1656` or `1656P4` or `Unrated` |
| ratingBlitzOnline | str | Member's USCF Online Blitz rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Blitz games have been played. `1720` or `1720P13` or `Unrated` |
| ratingQuickOnline | str | Member's USCF Online Quick rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Quick games have been played. `939` or `939P20` or `Unrated` |
| ratingRegularOnline | str | Member's USCF Online Regular rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Online Regular games have been played. `1044` or `1044P16` or `Unrated` |
| ratingCorrespondence | str | Member's USCF Correspondence rating. Suffixed by PXX where XX is the number of games played if the rating is provisional. 'Unrated' if no Correspondence games have been played. `1680` or `1680P14` or `Unrated` |