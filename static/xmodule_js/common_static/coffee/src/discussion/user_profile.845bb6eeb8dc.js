// Generated by CoffeeScript 1.6.3
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    this.DiscussionUserProfileView = (function(_super) {
      __extends(DiscussionUserProfileView, _super);

      function DiscussionUserProfileView() {
        _ref = DiscussionUserProfileView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      DiscussionUserProfileView.prototype.toggleModeratorStatus = function(event) {
        var $elem, confirmValue, isModerator, url,
          _this = this;
        confirmValue = confirm("Are you sure?");
        if (!confirmValue) {
          return;
        }
        $elem = $(event.target);
        if ($elem.hasClass("sidebar-promote-moderator-button")) {
          isModerator = true;
        } else if ($elem.hasClass("sidebar-revoke-moderator-button")) {
          isModerator = false;
        } else {
          console.error("unrecognized moderator status");
          return;
        }
        url = DiscussionUtil.urlFor('update_moderator_status', $$profiled_user_id);
        return DiscussionUtil.safeAjax({
          $elem: $elem,
          url: url,
          type: "POST",
          dataType: 'json',
          data: {
            is_moderator: isModerator
          },
          error: function(response, textStatus, e) {
            return console.log(e);
          },
          success: function(response, textStatus) {
            var parent, view;
            parent = _this.$el.parent();
            _this.$el.replaceWith(response.html);
            return view = new DiscussionUserProfileView({
              el: parent.children(".user-profile")
            });
          }
        });
      };

      DiscussionUserProfileView.prototype.events = {
        "click .sidebar-toggle-moderator-button": "toggleModeratorStatus"
      };

      return DiscussionUserProfileView;

    })(Backbone.View);
  }

}).call(this);
