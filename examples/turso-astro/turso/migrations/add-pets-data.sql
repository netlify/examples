insert into pets(name, greeting, image, snuggles, bio)
select
    name,
    greeting,
    image,
    snuggles,
    bio
from `temp-table`