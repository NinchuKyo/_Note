//
//  DetailViewController.m
//  _Note
//
//  Created by Lyndon Quigley on 2/4/2014.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import "NoteEditorViewController.h"

#import "Note.h"
#import <DropboxSDK/DropboxSDK.h>

@interface NoteEditorViewController () <UITextViewDelegate, DBRestClientDelegate>
@property (strong, nonatomic) UIPopoverController *masterPopoverController;
@property (weak, nonatomic) IBOutlet UITextView *textView;
@property (weak, nonatomic) IBOutlet UITextView *noteTitle;
@property (nonatomic, strong) DBRestClient *restClient;

- (void)configureView;
@end

@implementation NoteEditorViewController

#pragma mark - Managing the detail item

- (void)setDetailItem:(id)newDetailItem
{
    if (_detailItem != newDetailItem) {
        _detailItem = newDetailItem;
        
        // Update the view.
        [self configureView];
    }

    if (self.masterPopoverController != nil) {
        [self.masterPopoverController dismissPopoverAnimated:YES];
    }        
}

- (void)configureView
{
    // Update the user interface for the detail item.

    if (self.detailItem) {
        self.detailDescriptionLabel.text = [self.detailItem description];
    }
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    self.noteTitle.text = self.note.title;
    self.noteTitle.delegate = self;
    self.textView.text = self.note.contents;
    self.textView.delegate = self;
    self.textView.font = [UIFont preferredFontForTextStyle:UIFontTextStyleBody];
    
    self.restClient = [[DBRestClient alloc] initWithSession:[DBSession sharedSession]];
    self.restClient.delegate = self;

    [self configureView];
}

- (void)textViewDidEndEditing:(UITextView *)textView
{
    // copy the updated note text to the underlying model.
    switch(textView.tag){
        case 0:
            _note.contents = textView.text;
            break;
        case 1:
            if ((_noteTitle.text).length > 0){
                _note.titleString = _noteTitle.text;
                _note.setTitle = YES;
            } else {
                _noteTitle.text = _note.title;
            }
            break;
    }
}

/* Change button info
- (IBAction)checkLink : (id) sender {
    UIButton *button = (UIButton *) sender;
    if (![[DBSession sharedSession] isLinked]) {
        [button setTitle:@"Unlink" forState:UIControlStateNormal];
    } else {
        [button setTitle:@"Link to Dropbox" forState:UIControlStateNormal];
    }
}
*/

- (IBAction)didPressLink{
    if (![[DBSession sharedSession] isLinked]) {
        [[DBSession sharedSession] linkFromController:self];
    } else {
        [[DBSession sharedSession] unlinkAll];
    }
}

- (IBAction)viewNoteLink{
    
    self.restClient = [[DBRestClient alloc] initWithSession:[DBSession sharedSession]];
    self.restClient.delegate = self;
    
    [self.restClient loadMetadata:@"/"];
}

/*
- (void)textFieldDidEndEditing:(UITextField *)noteTitle
{
    NSLog(@"Got here");
    if ((noteTitle.text).length > 0){
        _note.titleString = noteTitle.text;
        _note.setTitle = YES;
    } else {
        noteTitle.text = _note.title;
    }
}
*/

- (void)restClient:(DBRestClient *)client loadedMetadata:(DBMetadata *)metadata {
    if (metadata.isDirectory) {
        NSLog(@"Folder '%@' contains:", metadata.path);
        for (DBMetadata *file in metadata.contents) {
            NSLog(@"	%@", file.filename);
        }
    }
}

- (void)restClient:(DBRestClient *)client
loadMetadataFailedWithError:(NSError *)error {
    NSLog(@"Error loading metadata: %@", error);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Split view

- (void)splitViewController:(UISplitViewController *)splitController willHideViewController:(UIViewController *)viewController withBarButtonItem:(UIBarButtonItem *)barButtonItem forPopoverController:(UIPopoverController *)popoverController
{
    barButtonItem.title = NSLocalizedString(@"Your Notes", @"Your Notes");
    [self.navigationItem setLeftBarButtonItem:barButtonItem animated:YES];
    self.masterPopoverController = popoverController;
}

- (void)splitViewController:(UISplitViewController *)splitController willShowViewController:(UIViewController *)viewController invalidatingBarButtonItem:(UIBarButtonItem *)barButtonItem
{
    // Called when the view is shown again in the split view, invalidating the button and popover controller.
    [self.navigationItem setLeftBarButtonItem:nil animated:YES];
    self.masterPopoverController = nil;
}

@end
