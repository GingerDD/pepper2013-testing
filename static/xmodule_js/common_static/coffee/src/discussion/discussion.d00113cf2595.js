// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    this.Discussion = (function(_super) {
      __extends(Discussion, _super);

      function Discussion() {
        _ref = Discussion.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Discussion.prototype.model = Thread;

      Discussion.prototype.initialize = function(models, options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        this.pages = options['pages'] || 1;
        this.current_page = 1;
        this.bind("add", function(item) {
          return item.discussion = _this;
        });
        this.comparator = this.sortByDateRecentFirst;
        return this.on("thread:remove", function(thread) {
          return _this.remove(thread);
        });
      };

      Discussion.prototype.find = function(id) {
        return _.first(this.where({
          id: id
        }));
      };

      Discussion.prototype.hasMorePages = function() {
        return this.current_page < this.pages;
      };

      Discussion.prototype.addThread = function(thread, options) {
        var model;
        if (!this.find(thread.id)) {
          options || (options = {});
          model = new Thread(thread);
          this.add(model);
          return model;
        }
      };

      Discussion.prototype.retrieveAnotherPage = function(mode, options, sort_options) {
        var data, url,
          _this = this;
        if (options == null) {
          options = {};
        }
        if (sort_options == null) {
          sort_options = {};
        }
        this.current_page += 1;
        data = {
          page: this.current_page
        };
        switch (mode) {
          case 'search':
            url = DiscussionUtil.urlFor('search');
            data['text'] = options.search_text;
            break;
          case 'commentables':
            url = DiscussionUtil.urlFor('search');
            data['commentable_ids'] = options.commentable_ids;
            break;
          case 'all':
            url = DiscussionUtil.urlFor('threads');
            break;
          case 'flagged':
            data['flagged'] = true;
            url = DiscussionUtil.urlFor('search');
            break;
          case 'followed':
            url = DiscussionUtil.urlFor('followed_threads', options.user_id);
        }
        if (options['group_id']) {
          data['group_id'] = options['group_id'];
        }
        data['sort_key'] = sort_options.sort_key || 'date';
        data['sort_order'] = sort_options.sort_order || 'desc';
        return DiscussionUtil.safeAjax({
          $elem: this.$el,
          url: url,
          data: data,
          dataType: 'json',
          success: function(response, textStatus) {
            var models, new_collection, new_threads;
            models = _this.models;
            new_threads = [
              (function() {
                var _i, _len, _ref1, _results;
                _ref1 = response.discussion_data;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  data = _ref1[_i];
                  _results.push(new Thread(data));
                }
                return _results;
              })()
            ][0];
            new_collection = _.union(models, new_threads);
            Content.loadContentInfos(response.annotated_content_info);
            _this.reset(new_collection);
            _this.pages = response.num_pages;
            return _this.current_page = response.page;
          }
        });
      };

      Discussion.prototype.sortByDate = function(thread) {
        var today;
        if (thread.get('pinned')) {
          today = new Date();
          return new Date(today.getTime() + (24 * 60 * 60 * 1000));
        } else {
          return thread.get("created_at");
        }
      };

      Discussion.prototype.sortByDateRecentFirst = function(thread) {
        var today;
        if (thread.get('pinned')) {
          today = new Date();
          return -(new Date(today.getTime() + (24 * 60 * 60 * 1000)));
        } else {
          return -(new Date(thread.get("created_at")).getTime());
        }
      };

      Discussion.prototype.sortByVotes = function(thread1, thread2) {
        var thread1_count, thread2_count;
        thread1_count = parseInt(thread1.get("votes")['up_count']);
        thread2_count = parseInt(thread2.get("votes")['up_count']);
        if (thread2_count !== thread1_count) {
          return thread2_count - thread1_count;
        } else {
          return thread2.created_at_time() - thread1.created_at_time();
        }
      };

      Discussion.prototype.sortByComments = function(thread1, thread2) {
        var thread1_count, thread2_count;
        thread1_count = parseInt(thread1.get("comments_count"));
        thread2_count = parseInt(thread2.get("comments_count"));
        if (thread2_count !== thread1_count) {
          return thread2_count - thread1_count;
        } else {
          return thread2.created_at_time() - thread1.created_at_time();
        }
      };

      return Discussion;

    })(Backbone.Collection);
  }

}).call(this);
