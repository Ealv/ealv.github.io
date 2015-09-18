# Copyright (c) 2015, Rentabiliweb Group
#
# Permission  to use,  copy, modify,  and/or  distribute this  software for  any
# purpose  with  or without  fee  is hereby  granted,  provided  that the  above
# copyright notice and this permission notice appear in all copies.
#
# THE SOFTWARE IS PROVIDED "AS IS"  AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
# REGARD TO  THIS SOFTWARE INCLUDING  ALL IMPLIED WARRANTIES  OF MERCHANTABILITY
# AND FITNESS.  IN NO EVENT SHALL  THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
# INDIRECT, OR  CONSEQUENTIAL DAMAGES OR  ANY DAMAGES WHATSOEVER  RESULTING FROM
# LOSS OF USE, DATA OR PROFITS,  WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
# OTHER  TORTIOUS ACTION,  ARISING  OUT OF  OR  IN CONNECTION  WITH  THE USE  OR
# PERFORMANCE OF THIS SOFTWARE.

# https://nodejs.org/

FROM rentabiliweb/debian:wheezy
MAINTAINER Rentabiliweb Group

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
      build-essential

# get node.js (https://nodejs.org/)
# RUN curl -Ls https://deb.nodesource.com/setup_0.12 | bash && \
#     apt-get update && \
#     apt-get install -y nodejs

# get node.js (https://nodejs.org/)
RUN curl -Ls https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key --keyring /etc/apt/trusted.gpg.d/nodejs-keyring.gpg add - && \
    echo 'deb https://deb.nodesource.com/node_0.12 wheezy main' > /etc/apt/sources.list.d/nodejs.list && \
    apt-get update && \
    apt-get install -y \
      nodejs rlwrap

# get npm (https://www.npmjs.com/)
RUN curl -Ls curl https://www.npmjs.org/install.sh | bash

# clean
RUN find /usr/share/doc     -type f ! -name copyright -delete && \
    find /usr/share/i18n    -type f -delete && \
    find /usr/share/locale  -type f -delete && \
    find /usr/share/man     -type f -delete && \
    find /var/cache/apt     -type f -delete && \
    find /var/lib/apt/lists -type f -delete



ADD . /var/app
RUN mkdir -p /var/app

WORKDIR /var/app
CMD node test.js
