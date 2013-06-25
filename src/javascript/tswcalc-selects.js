function SelectHandler(slot) {
    var self = this;

    this.initiate = function() {
        this.bindEvents();
        this.addSignetsToSelect();
    };

    this.bindEvents = function() {
        slots[slot.id_prefix].el.role.change(this.roleChange);
        slots[slot.id_prefix].el.ql.change(this.qlChange);
        slots[slot.id_prefix].el.glyphQl.change(this.glyphChange);
        slots[slot.id_prefix].el.primaryGlyph.change(this.glyphChange);
        slots[slot.id_prefix].el.secondaryGlyph.change(this.glyphChange);
        slots[slot.id_prefix].el.signetId.change(this.signetChange);
        slots[slot.id_prefix].el.signetQuality.change(this.signetChange);
    };

    this.addSignetsToSelect = function() {
        slots[slot.id_prefix].el.signetId.append($('<option>', {
            value: "none",
            text: "None",
            selected: "true"
        }));

        this.updateToDefaultSignet();

        var signetsInSlotGroup = $.merge([], signet_data[slot.group]);
        // weapon signets can also be slotted in head
        $.merge(signetsInSlotGroup, this.getSignetsForHead(slot.group));
        signetsInSlotGroup.sort(function(a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
            } else {
                return -1;
            }
        });
        $.each(signetsInSlotGroup, function(index, value) {
            slots[slot.id_prefix].el.signetId.append($('<option>', {
                value: value.id,
                text: value.name
            }));
        });
    };

    this.updateToDefaultSignet = function() {
        var signet_icon_url = 'assets/images/icons/' + slot.group + '_dps.png';
        var signet_quality_url = 'assets/images/icons/normal.png';
        $('#' + slot.id_prefix + '-signet-img-icon').attr('src', signet_icon_url);
        $('#' + slot.id_prefix + '-signet-img-quality').attr('src', signet_quality_url);
    };

    this.getSignetsForHead = function(group) {
        if (group == 'head') {
            return signet_data['weapon'];
        }
        return [];
    };

    this.signetChange = function(event) {
        slots[slot.id_prefix].updateSignet();
        tswcalc.summary.updatePrimaryStats();
    };

    this.roleChange = function(event) {
        var role = $(this).val();
        if(ny_raid_items[slot.id_prefix][role] === undefined) {
            slots[slot.id_prefix].el.btn.nyraid.attr('checked', false);
            slots[slot.id_prefix].el.btn.nyraid.attr('disabled', 'disabled');
        } else {
            slots[slot.id_prefix].el.btn.nyraid.removeAttr('disabled');
        }
        if(slots[slot.id_prefix].el.btn.nyraid.is(':checked')) {
            raidCheckboxes[slot.id_prefix].changeToRaidItem();
        } else {
            raidCheckboxes[slot.id_prefix].changeToCustomItem();
        }
        tswcalc.summary.updatePrimaryStats();
    };

    this.qlChange = function(event) {
        tswcalc.summary.updatePrimaryStats();
    };

    this.glyphChange = function(id_suffix) {
        tswcalc.summary.updateOffensiveDefensiveStats();
    };
}